// Copyright 2026 Anthropic PBC
// SPDX-License-Identifier: Apache-2.0
//
// Modified by Yash Kothari, 2026: wrapped commands, every risky part measured,
// and Claude Code's permission dialog in place of the AbovePrompt band.
//
// Blast Radius: holds a risky Bash command and shows what it would change.
//
// tool.call (Bash): if the command is risky, work out its blast radius, open a
// pane with Proceed and Cancel, and hold the call until one is pressed.
// ui.render (Pane): draws the report.
// tool.check (Bash): if the surface won't place the pane (a narrow terminal),
// Claude Code's own permission dialog asks instead, with the report as reason.
// The AbovePrompt band is not used: other mods draw there and can hide it.
//
// Holding: a hook has 10 s of its own time, but time spent inside a `$` call is
// free. So the hold loop waits on a short `$.process.run(["sleep", ...])` until
// a button's onPress sets the decision.
//
// The host reads `on(...)` and `$.noun.method(...)` from source, so they are
// spelled literally, and helpers that take `$` are top-level functions.

const PANE_ID = "blast-radius";
const POLL_SECONDS = "0.25";
const HOLD_LIMIT_MS = 10 * 60 * 1000;
const LIST_MAX = 10;
const PARTS_MAX = 4;

// The call being held, or null. One at a time: Bash calls in a turn run in order.
let held = null;

// Reasons for the permission dialog, by call, for calls with no room for a pane.
const asks = new Map();

export function register(on) {
  on("tool.call", { tool: "Bash" }, async ($, e, next) => {
    const risks = classify(String(e.command ?? ""));
    if (risks.length === 0) {
      return next(e);
    }
    // One hold at a time. If another risky call is already held (a subagent's,
    // say), wait until it is answered. `held` is claimed with no await between
    // the check and the claim, so two waiting calls can't both get through.
    while (held !== null) {
      if (next.signal.aborted) {
        return { deny: "Blast Radius held this command and did not run it: the turn was interrupted. Do not retry it unless the user asks you to." };
      }
      await $.process.run(["sleep", POLL_SECONDS], { timeoutMs: 5000 });
    }
    const mine = { command: String(e.command), risks, report: null, decision: null };
    held = mine;

    let opened = { isPlaced: false };
    let decision;
    let summary = risks.map((r) => r.label).join("; ");
    try {
      mine.report = await measureAll($, risks, await $.session.cwd());
      summary = mine.report.summary;

      opened = await $.ui.open({ id: PANE_ID, title: "Blast Radius", focus: true, rows: paneRows(mine.report) });
      if (!opened.isPlaced) {
        mine.decision = "ask";
      }
      $.ui.invalidate("ui.render");

      const startedAt = await $.clock.now();
      while (mine.decision === null) {
        if (next.signal.aborted) {
          mine.decision = "interrupted";
          break;
        }
        if ((await $.clock.now()) - startedAt > HOLD_LIMIT_MS) {
          mine.decision = "timeout";
          break;
        }
        await $.process.run(["sleep", POLL_SECONDS], { timeoutMs: 5000 });
      }
    } catch {
      mine.decision = "error"; // anything unexpected refuses the command
    } finally {
      decision = mine.decision;
      // Close this call's pane before releasing the hold, so the next call's
      // pane can't be the one that gets closed.
      try {
        if (opened.isPlaced) {
          await $.ui.close({ id: PANE_ID });
        }
      } catch {
        // the pane is already gone
      }
      if (held === mine) {
        held = null;
      }
      $.ui.invalidate("ui.render");
    }

    if (decision === "proceed") {
      $.ui.toast("Blast Radius: running it");
      return next(e);
    }
    if (decision === "ask") {
      asks.set(askKey(e.tool_use_id, e.command), askReason(mine.report));
      return next(e);
    }
    const why = {
      cancel: "the user pressed Cancel",
      timeout: "no answer within 10 minutes",
      interrupted: "the turn was interrupted",
      error: "Blast Radius hit an error while holding it",
    }[decision] ?? "no answer was recorded";
    return {
      deny: `Blast Radius held this command and did not run it: ${why}. It would have: ${summary}. Do not retry it unless the user asks you to.`,
    };
  }).catch(($, e, next) =>
    next.called ? next(e) : { deny: "Blast Radius failed while it checked this command, so it did not run it. Do not retry it unless the user asks you to." },
  );

  // A rule that already refuses the call stands. Any other verdict, an allow
  // from a rule or a mode included, becomes a question to the person.
  on("tool.check", { tool: "Bash" }, async ($, e, next) => {
    const key = askKey(e.tool_use_id, e.input?.command);
    const reason = asks.get(key);
    if (reason === undefined) {
      return next(e);
    }
    asks.delete(key);
    const verdict = await next(e);
    if (verdict.decision === "deny") {
      return verdict;
    }
    return { decision: "ask", reason, decider: "person" };
  }).catch(() => ({ decision: "deny", reason: "Blast Radius failed while it asked about this command, so it did not run it." }));

  on("ui.render", { component: "Pane" }, ($, e, next) => {
    if (e.requestId !== PANE_ID || held === null || held.report === null) {
      return next(e);
    }
    return draw($.ui.resolve(e), held);
  });
}

function askKey(toolUseId, command) {
  return toolUseId ?? `command:${command}`;
}

/** One sentence for the permission dialog: what each part would change, with a few paths. */
function askReason(report) {
  const parts = report.parts.map((part) => {
    const shown = part.lines.slice(0, 3);
    const rest = part.lines.length - shown.length + (part.more ?? 0);
    const sample = shown.length === 0 ? "" : ` (${shown.join(", ")}${rest > 0 ? `, + ${rest} more` : ""})`;
    return `${part.summary}${sample}`;
  });
  return `Blast Radius: this command would ${parts.join("; and ")}.`;
}

// ---- What counts as risky -------------------------------------------------

// sudo options that take a value, so the value isn't read as the command.
const SUDO_VALUE_OPTIONS = new Set(["-u", "-g", "-C", "-D", "-h", "-p", "-r", "-t", "-T", "-U"]);
// Commands that only read, so a bare word "migrate" in them isn't a migration.
const READ_ONLY = new Set(["ls", "cat", "echo", "printf", "grep", "rg", "find", "less", "head", "tail", "cd", "git"]);

/** A folder a later `cd arg` moves to, given the folder so far (null = the session folder). */
function joinDir(dir, arg) {
  if (arg === undefined || arg === "~" || arg.startsWith("/") || arg.startsWith("~/")) {
    return arg ?? "~";
  }
  return dir ? `${dir}/${arg}` : arg;
}

/**
 * Splits a command line on && || ; | and line breaks outside quotes, so the
 * script of `bash -c "a && b"` and the `\;` of `find -exec` stay whole.
 */
function splitCommand(command) {
  const segments = [];
  let current = "";
  let quote = null;
  for (let i = 0; i < command.length; i += 1) {
    const c = command[i];
    if (c === "\\" && quote !== "'" && i + 1 < command.length) {
      current += c + command[i + 1];
      i += 1;
    } else if (quote !== null) {
      current += c;
      if (c === quote) {
        quote = null;
      }
    } else if (c === "'" || c === '"') {
      quote = c;
      current += c;
    } else if (command.startsWith("&&", i) || command.startsWith("||", i)) {
      segments.push(current);
      current = "";
      i += 1;
    } else if (c === ";" || c === "|" || c === "\n") {
      segments.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  segments.push(current);
  return segments;
}

/** Every risky segment of a shell command, in order; empty if none. */
function classify(command, startDir = null, depth = 0) {
  const risks = [];
  let dir = startDir; // where a `cd` earlier on the line moved to; null means the session folder
  const scopes = []; // dir to restore when a ( subshell ) closes
  const pushed = []; // pushd stack, for popd
  for (const raw of splitCommand(command)) {
    const opens = (raw.match(/^\s*\(+/)?.[0].trim().length) ?? 0;
    // Trailing redirects and & don't hide a closing ) : `(cd sub && make) > log`.
    const tail = raw.replace(/(?:\s*(?:\d*>>?|&>>?|<)\s*\S+|\s*&)+\s*$/, "");
    const closes = (tail.match(/\)+\s*$/)?.[0].trim().length) ?? 0;
    for (let k = 0; k < opens; k += 1) {
      scopes.push(dir);
    }
    const found = classifySegment(raw, dir, pushed, depth);
    if (found.cd !== undefined) {
      dir = found.cd; // a cd, pushd or popd moved the folder
    } else {
      risks.push(...found);
    }
    for (let k = 0; k < closes && scopes.length > 0; k += 1) {
      dir = scopes.pop(); // a cd inside ( ... ) doesn't outlive it
    }
  }
  return risks;
}

// Words that can come before the real command without changing what it does.
const PREFIXES = new Set(["command", "exec", "nohup", "then", "do", "else", "!"]);
const DOAS_VALUE_OPTIONS = new Set(["-u", "-C"]);
const ENV_VALUE_OPTIONS = new Set(["-u", "--unset", "-C", "--chdir", "-S", "--split-string"]);
const TIMEOUT_VALUE_OPTIONS = new Set(["-s", "--signal", "-k", "--kill-after"]);
const XARGS_VALUE_OPTIONS = new Set(["-n", "-L", "-P", "-s", "-d", "-E", "-I", "-a", "-J", "-R", "-S"]);
const SHELLS = new Set(["bash", "sh", "zsh", "dash", "ksh"]);
const FIND_EXEC = new Set(["-exec", "-execdir", "-ok", "-okdir"]);

/** The command's name without a leading \ (which skips aliases) or a folder. */
function baseName(word) {
  return word.replace(/^\\/, "").split("/").pop();
}

/** Drops leading options from words, and the value after each option in valueOptions. */
function dropOptions(words, valueOptions) {
  while (words.length > 0 && words[0].startsWith("-") && words[0] !== "-" && words[0] !== "--") {
    if (valueOptions.has(words.shift())) {
      words.shift();
    }
  }
  if (words[0] === "--") {
    words.shift();
  }
}

/**
 * Removes the words before the real command: VAR=value, sudo, doas, env,
 * time, timeout, nice and the PREFIXES, each with its own options.
 */
function unwrap(words) {
  for (;;) {
    const word = words[0];
    if (word === undefined) {
      return words;
    }
    const name = baseName(word);
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(word) || PREFIXES.has(word)) {
      words.shift();
    } else if (name === "sudo" || name === "doas") {
      words.shift();
      dropOptions(words, name === "sudo" ? SUDO_VALUE_OPTIONS : DOAS_VALUE_OPTIONS);
    } else if (name === "env") {
      words.shift();
      dropOptions(words, ENV_VALUE_OPTIONS);
    } else if (name === "time") {
      words.shift();
      dropOptions(words, new Set());
    } else if (name === "timeout") {
      words.shift();
      dropOptions(words, TIMEOUT_VALUE_OPTIONS);
      words.shift(); // the duration
    } else if (name === "nice") {
      words.shift();
      if (words[0] === "-n") {
        words.splice(0, 2);
      } else if (/^-n?-?\d+$/.test(words[0] ?? "")) {
        words.shift();
      }
    } else {
      return words;
    }
  }
}

/** The risk of an rm with these arguments, or null for an rm that is neither -r nor -f. */
function rmRisk(args, dir) {
  const flags = args.filter((a) => a.startsWith("-"));
  const recursive = flags.some((f) => f === "--recursive" || (/^-[^-]/.test(f) && /[rR]/.test(f)));
  const force = flags.some((f) => f === "--force" || (/^-[^-]/.test(f) && f.includes("f")));
  if (!recursive && !force) {
    return null;
  }
  const targets = args.filter((a) => !a.startsWith("-") || a === "-");
  return { kind: "rm", label: `rm ${flags.join(" ")}`.trim(), targets, dir };
}

/** One segment: { cd } for a folder change, else its risks (empty if none). */
function classifySegment(segment, dir, pushed, depth) {
  {
    const words = unwrap(tokenize(segment.trim().replace(/^[({]+\s*/, "").replace(/\s*[)}]+$/, "")));
    const [first, ...args] = words;
    if (first === undefined) {
      return [];
    }
    const cmd = baseName(first);
    if (cmd === "cd") {
      return { cd: args[0] === "-" ? "-" : joinDir(dir, args[0]) };
    }
    if (cmd === "pushd") {
      pushed.push(dir);
      return { cd: joinDir(dir, args[0]) };
    }
    if (cmd === "popd") {
      return { cd: pushed.length > 0 ? pushed.pop() : "-" };
    }
    if (SHELLS.has(cmd)) {
      // `bash -c 'script'`: the script runs in a child shell, so a cd in it stays there.
      const at = args.findIndex((a) => /^-[a-zA-Z]*c[a-zA-Z]*$/.test(a));
      return at !== -1 && args[at + 1] !== undefined && depth < 3 ? classify(args[at + 1], dir, depth + 1) : [];
    }
    if (cmd === "rm") {
      const risk = rmRisk(args, dir);
      return risk === null ? [] : [risk];
    }
    if (cmd === "xargs") {
      // xargs gets its paths from the command before the pipe, so even a plain rm is held.
      const rest = [...args];
      dropOptions(rest, XARGS_VALUE_OPTIONS);
      const inner = unwrap(rest);
      return inner[0] !== undefined && baseName(inner[0]) === "rm"
        ? [{ kind: "rm-stdin", label: `xargs ${inner.join(" ")}`, dir }]
        : [];
    }
    if (cmd === "find") {
      const execRm = args.some((a, i) => FIND_EXEC.has(a) && args[i + 1] !== undefined && baseName(args[i + 1]) === "rm");
      if (args.includes("-delete") || execRm) {
        return [{ kind: "find-delete", label: args.includes("-delete") ? "find -delete" : "find -exec rm", args, dir }];
      }
    }
    if (cmd === "git") {
      // Git's own options come before the subcommand; -C moves where it runs.
      let gitDir = dir;
      let i = 0;
      while (i < args.length && args[i].startsWith("-")) {
        if (args[i] === "-C" && i + 1 < args.length) {
          gitDir = joinDir(gitDir, args[i + 1]);
          i += 2;
        } else if (args[i] === "-c" && i + 1 < args.length) {
          i += 2;
        } else {
          i += 1;
        }
      }
      const sub = args[i];
      const rest = args.slice(i + 1);
      if (sub === "reset" && rest.includes("--hard")) {
        return [{ kind: "git-reset", label: "git reset --hard", args: rest, dir: gitDir }];
      }
      if (sub === "clean") {
        return [{ kind: "git-clean", label: "git clean", args: rest, dir: gitDir }];
      }
      if (sub === "push" && rest.some((a) => a === "--force" || a === "-f" || a.startsWith("--force-with-lease") || /^\+/.test(a))) {
        return [{ kind: "git-push-force", label: "git push --force", args: rest, dir: gitDir }];
      }
      const stagedOnly = sub === "restore" && rest.includes("--staged") && !rest.includes("--worktree") && !rest.includes("-W");
      if ((sub === "checkout" || sub === "restore") && rest.includes(".") && !stagedOnly) {
        return [{ kind: "git-checkout", label: `git ${sub} -- .`, args: rest, dir: gitDir }];
      }
    }
    const joined = words.join(" ");
    if (/\balembic\s+upgrade\b/.test(joined)) {
      return [{ kind: "migrate", tool: "alembic", label: "alembic upgrade", dir }];
    }
    if (/\bdb:migrate(?!:status\b)/.test(joined)) {
      return [{ kind: "migrate", tool: "rails", label: "db:migrate", dir }];
    }
    if (/\bprisma\s+migrate\b/.test(joined)) {
      return [{ kind: "migrate", tool: "prisma", label: "prisma migrate", dir }];
    }
    if (/\bmanage\.py\s+migrate\b/.test(joined)) {
      return [{ kind: "migrate", tool: "django", label: "manage.py migrate", dir }];
    }
    if (!READ_ONLY.has(cmd) && args.includes("migrate")) {
      return [{ kind: "migrate", tool: "unknown", label: "migrate", dir }];
    }
  }
  return [];
}

// Resolves a `cd` target to an absolute folder, or null if it doesn't exist.
// The target is passed as an argument, never as source.
const CD_SCRIPT = `unset CDPATH; d="$1"; case "$d" in "~") d="$HOME";; "~/"*) d="$HOME/\${d#\\~/}";; esac; cd -- "$d" 2>/dev/null && pwd -P`;

async function resolveDir($, sessionCwd, dir) {
  if (dir === "-") {
    return null; // `cd -` depends on the shell's history
  }
  const run = await $.process.run(["bash", "-c", CD_SCRIPT, "blast-radius", dir], { cwd: sessionCwd, timeoutMs: 5000 });
  const out = run.stdout.trim();
  return run.exitCode === 0 && out !== "" ? out : null;
}

/** Splits one segment into words, honouring quotes. Good enough to read flags and paths. */
function tokenize(text) {
  const words = [];
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    words.push(m[1] ?? m[2] ?? m[3]);
  }
  return words;
}

// ---- Measuring the blast radius -------------------------------------------

/**
 * { summary, parts } for the pane, one part per risky segment, each measured
 * where it will run: the session folder, moved by any `cd dir &&` or
 * `git -C dir` earlier in the same command line. Proceed runs every part, so
 * the pane must show every part.
 */
async function measureAll($, risks, sessionCwd) {
  const parts = [];
  for (const risk of risks.slice(0, PARTS_MAX)) {
    const cwd = risk.dir ? await resolveDir($, sessionCwd, risk.dir) : sessionCwd;
    const report = cwd === null
      ? { summary: `${risk.label} in ${risk.dir}`, lines: [], note: `Couldn't find the folder ${risk.dir}, so I couldn't measure what this would change.` }
      : await measure($, risk, cwd);
    parts.push({ label: risk.label, ...report });
  }
  if (risks.length > PARTS_MAX) {
    const rest = risks.slice(PARTS_MAX);
    parts.push({ label: "more", summary: `run ${rest.length} more risky ${rest.length === 1 ? "part" : "parts"}`, lines: [], note: `Not measured: ${rest.map((r) => r.label).join(", ")}.` });
  }
  return { summary: parts.map((p) => p.summary).join("; and "), parts };
}

/** { summary, lines, note } for one part. Never throws: a failed read is said, not hidden. */
async function measure($, risk, cwd) {
  try {
    if (risk.kind === "rm") {
      return await measureRm($, risk, cwd);
    }
    if (risk.kind === "rm-stdin") {
      return { summary: "delete the paths piped into xargs", lines: [], note: "The command before the pipe makes the list, so I can't measure it without running that command." };
    }
    if (risk.kind === "find-delete") {
      return await measureFind($, risk, cwd);
    }
    if (risk.kind === "migrate") {
      return await measureMigrations($, risk, cwd);
    }
    return await measureGit($, risk, cwd);
  } catch (error) {
    return { summary: `${risk.label} (could not measure it)`, lines: [], note: `Could not measure: ${String(error?.message ?? error).slice(0, 200)}` };
  }
}

// The paths are passed to bash as arguments, never as source, so nothing in
// them runs. compgen -G expands a glob without command substitution.
const RM_SCRIPT = `
shopt -s nullglob dotglob
paths=()
for p in "$@"; do
  case "$p" in "~"|"~/"*) p="$HOME\${p#\\~}";; esac
  if [[ "$p" == *[*?[]* ]]; then
    while IFS= read -r m; do paths+=("$m"); done < <(compgen -G "$p")
  elif [[ -e "$p" || -L "$p" ]]; then
    paths+=("$p")
  fi
done
if (( \${#paths[@]} == 0 )); then echo "0 0 0"; exit 0; fi
# A relative path gets ./ in front, so find never reads a name like -delete as an action.
for i in "\${!paths[@]}"; do case "\${paths[$i]}" in /*) ;; *) paths[$i]="./\${paths[$i]}";; esac; done
files=$(find "\${paths[@]}" \\( -type f -o -type l \\) 2>/dev/null | wc -l | tr -d ' ')
kb=$(du -skc "\${paths[@]}" 2>/dev/null | tail -n1 | cut -f1)
echo "$files $(( \${kb:-0} * 1024 )) \${#paths[@]}"
find "\${paths[@]}" \\( -type f -o -type l \\) 2>/dev/null | head -n ${LIST_MAX}
`;

async function measureRm($, risk, cwd) {
  if (risk.targets.length === 0) {
    return { summary: "rm with no paths", lines: [], note: "No paths to expand." };
  }
  const run = await $.process.run(["bash", "-c", RM_SCRIPT, "blast-radius", ...risk.targets], { cwd, timeoutMs: 15000 });
  const [head, ...rest] = run.stdout.split("\n").filter((l) => l !== "");
  const [files, bytes, found] = (head ?? "0 0 0").split(" ").map(Number);
  if (!found) {
    return { summary: `delete nothing: no file matches ${risk.targets.join(" ")}`, lines: [], note: "The paths don't exist, so rm has nothing to remove." };
  }
  if (!files) {
    return { summary: `delete ${found} ${found === 1 ? "path" : "paths"} with no files in ${found === 1 ? "it" : "them"}`, lines: [], note: `Paths: ${risk.targets.join(" ")}` };
  }
  return {
    summary: `delete ${files} ${files === 1 ? "file" : "files"} (about ${size(bytes)})`,
    lines: rest.map((l) => l.replace(/^\.\//, "")),
    more: Math.max(0, files - rest.length),
    note: `Paths: ${risk.targets.join(" ")}`,
  };
}

// The output is cut in awk, so a large tree doesn't fill the hook's memory.
const FIND_SCRIPT = `find "$@" 2>/dev/null | awk -v max=${LIST_MAX} 'NR <= max { print } END { print NR }'; exit "\${PIPESTATUS[0]}"`;
const FIND_ONE_VALUE_ACTIONS = new Set(["-printf", "-fprint", "-fprint0", "-fls"]);
const FIND_PLAIN_ACTIONS = new Set(["-delete", "-print", "-print0", "-ls", "-quit"]);

/**
 * The same find with every action taken out, so it only lists: no -delete,
 * no -exec, and no -fprint that would write a file. The tests go in ( ),
 * so -print applies to the whole of them.
 */
function findDryRun(args) {
  const words = args.map((a) => a.replace(/^\\([();!])$/, "$1"));
  const head = [];
  let i = 0;
  while (i < words.length && /^-[HLP]$/.test(words[i])) {
    head.push(words[i]);
    i += 1;
  }
  while (i < words.length && !words[i].startsWith("-") && words[i] !== "(" && words[i] !== "!") {
    head.push(words[i]);
    i += 1;
  }
  const tests = [];
  for (; i < words.length; i += 1) {
    const w = words[i];
    if (FIND_EXEC.has(w)) {
      while (i + 1 < words.length && words[i + 1] !== ";" && words[i + 1] !== "+") {
        i += 1;
      }
      i += 1; // the ; or +
    } else if (FIND_ONE_VALUE_ACTIONS.has(w)) {
      i += 1;
    } else if (w === "-fprintf") {
      i += 2;
    } else if (!FIND_PLAIN_ACTIONS.has(w)) {
      tests.push(w);
    }
  }
  return tests.length === 0 ? [...head, "-print"] : [...head, "(", ...tests, ")", "-print"];
}

async function measureFind($, risk, cwd) {
  const run = await $.process.run(["bash", "-c", FIND_SCRIPT, "blast-radius", ...findDryRun(risk.args)], { cwd, timeoutMs: 15000 });
  const out = run.stdout.split("\n").filter((l) => l !== "");
  const count = Number(out.pop() ?? 0);
  if (run.exitCode !== 0 && count === 0) {
    return { summary: `${risk.label} (could not dry-run it)`, lines: [], note: "find failed without its actions, so I couldn't list what it would delete." };
  }
  return {
    summary: count === 0 ? "delete nothing: find matches no paths" : `delete ${count} ${count === 1 ? "path" : "paths"} that find matches`,
    lines: out.map((l) => l.replace(/^\.\//, "")),
    more: Math.max(0, count - out.length),
    note: "From the same find with its actions taken out.",
  };
}

async function measureGit($, risk, cwd) {
  if (risk.kind === "git-push-force") {
    return await measurePush($, risk, cwd);
  }
  if (risk.kind === "git-clean") {
    const flags = [];
    const paths = [];
    for (let i = 0; i < risk.args.length; i += 1) {
      const a = risk.args[i];
      if (a === "--") {
        paths.push(...risk.args.slice(i + 1));
        break;
      }
      if (a === "-e" || a === "--exclude") {
        flags.push(a, risk.args[i + 1] ?? "");
        i += 1;
      } else if (a.startsWith("--exclude=") || /^-e./.test(a)) {
        flags.push(a);
      } else if (/^-[a-zA-Z]+$/.test(a)) {
        const kept = a.replace(/[finq]/g, ""); // -n is added below; -f, -i and -q would change the dry run
        if (kept !== "-") {
          flags.push(kept);
        }
      } else if (!a.startsWith("-")) {
        paths.push(a);
      }
    }
    const run = await $.process.run(["git", "clean", "-n", ...flags, "--", ...paths], { cwd, timeoutMs: 15000 });
    if (run.exitCode !== 0) {
      return { summary: "git clean (could not dry-run it)", lines: [], note: run.stderr.trim().slice(0, 200) };
    }
    const gone = run.stdout.split("\n").filter((l) => l.startsWith("Would remove ")).map((l) => l.slice(13));
    return {
      summary: gone.length === 0 ? "remove nothing: no untracked files match" : `remove ${gone.length} untracked ${gone.length === 1 ? "path" : "paths"}`,
      lines: gone.slice(0, LIST_MAX),
      more: Math.max(0, gone.length - LIST_MAX),
      note: "From git clean -n. Untracked files are not in git, so they can't be recovered.",
    };
  }
  const status = await $.process.run(["git", "status", "--porcelain"], { cwd, timeoutMs: 15000 });
  if (status.exitCode !== 0) {
    return { summary: `${risk.label} (not a git repo here?)`, lines: [], note: status.stderr.trim().slice(0, 200) };
  }
  const rows = status.stdout.split("\n").filter((l) => l.length > 3 && !l.startsWith("??"));
  // reset --hard drops staged and unstaged changes; checkout -- . drops unstaged ones.
  const lost = risk.kind === "git-reset" ? rows : rows.filter((l) => l[1] !== " ");
  const stat = await $.process.run(["git", "diff", "--shortstat", risk.kind === "git-reset" ? "HEAD" : "--"], { cwd, timeoutMs: 15000 });
  return {
    summary: lost.length === 0 ? "discard nothing: no uncommitted changes" : `discard uncommitted changes in ${lost.length} ${lost.length === 1 ? "file" : "files"}`,
    lines: lost.slice(0, LIST_MAX).map((l) => `${l.slice(0, 2)} ${l.slice(3)}`),
    more: Math.max(0, lost.length - LIST_MAX),
    note: stat.stdout.trim() !== "" ? `${stat.stdout.trim()}. Uncommitted changes can't be recovered.` : "From git status --porcelain.",
  };
}

async function measurePush($, risk, cwd) {
  const positional = risk.args.filter((a) => !a.startsWith("-"));
  const remote = positional[0] ?? "origin";
  // A refspec is src:dst. With no colon, the local branch of the same name is pushed.
  const spec = (positional[1] ?? "").replace(/^\+/, "");
  let [source, branch] = spec.includes(":") ? spec.split(":") : [spec, spec];
  branch = (branch ?? "").replace(/^refs\/heads\//, "");
  if (!branch) {
    const head = await $.process.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], { cwd, timeoutMs: 10000 });
    branch = head.stdout.trim();
    source = "HEAD";
  } else if (branch === "HEAD") {
    // `git push origin HEAD` pushes the current branch to its namesake.
    const head = await $.process.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], { cwd, timeoutMs: 10000 });
    branch = head.stdout.trim();
    source = "HEAD";
  }
  source = source || "HEAD";
  const ref = `${remote}/${branch}`;
  const known = await $.process.run(["git", "rev-parse", "--verify", "--quiet", ref], { cwd, timeoutMs: 10000 });
  if (known.exitCode !== 0) {
    return { summary: `force-push to ${ref}`, lines: [], note: `No local copy of ${ref}, so I can't tell which commits the push would drop. Run git fetch first.` };
  }
  const log = await $.process.run(["git", "log", "--oneline", "--no-decorate", `${source}..${ref}`], { cwd, timeoutMs: 15000 });
  const dropped = log.stdout.split("\n").filter((l) => l !== "");
  return {
    summary: dropped.length === 0 ? `force-push to ${ref}: drops no commits` : `force-push to ${ref}: drops ${dropped.length} ${dropped.length === 1 ? "commit" : "commits"}`,
    lines: dropped.slice(0, LIST_MAX),
    more: Math.max(0, dropped.length - LIST_MAX),
    note: `Commits on ${ref} that ${source} doesn't have, as of the last fetch.`,
  };
}

const MIGRATION_LISTERS = {
  django: { argv: ["python3", "manage.py", "showmigrations", "--plan"], pending: (l) => l.startsWith("[ ]"), strip: (l) => l.slice(4) },
  alembic: { argv: ["alembic", "history", "-r", "current:head"], pending: (l) => l.includes("->"), strip: (l) => l },
  rails: { argv: ["bin/rails", "db:migrate:status"], pending: (l) => /^\s*down\b/.test(l), strip: (l) => l.trim() },
  prisma: { argv: ["npx", "--no-install", "prisma", "migrate", "status"], pending: (l) => /^\s{2}\S/.test(l), strip: (l) => l.trim() },
};

async function measureMigrations($, risk, cwd) {
  const lister = MIGRATION_LISTERS[risk.tool];
  if (lister === undefined) {
    return { summary: "run migrations", lines: [], note: "I can't list the pending migrations for this tool, so the list is not shown." };
  }
  let run;
  try {
    run = await $.process.run(lister.argv, { cwd, timeoutMs: 20000 });
  } catch (error) {
    run = { exitCode: -1, stdout: "", stderr: String(error?.message ?? error) };
  }
  if (run.exitCode !== 0) {
    return { summary: `run ${risk.label}`, lines: [], note: `Couldn't list pending migrations (${lister.argv.join(" ")} failed).` };
  }
  const pending = run.stdout.split("\n").filter(lister.pending).map(lister.strip);
  return {
    summary: pending.length === 0 ? `run ${risk.label}: nothing pending` : `apply ${pending.length} pending ${pending.length === 1 ? "migration" : "migrations"}`,
    lines: pending.slice(0, LIST_MAX),
    more: Math.max(0, pending.length - LIST_MAX),
    note: `From ${lister.argv.join(" ")}.`,
  };
}

function size(bytes) {
  if (!Number.isFinite(bytes) || bytes < 1024) {
    return `${bytes || 0} B`;
  }
  const units = ["KB", "MB", "GB", "TB"];
  let n = bytes;
  let i = -1;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
}

// ---- Drawing --------------------------------------------------------------

/** How many paths each part lists, so several parts share the pane's rows. */
function listCap(report) {
  return report.parts.length === 1 ? LIST_MAX : Math.max(2, Math.floor(LIST_MAX / report.parts.length));
}

function paneRows(report) {
  const cap = listCap(report);
  const partRows = report.parts.reduce((sum, p) => {
    const hidden = Math.max(0, p.lines.length - cap) + (p.more ?? 0);
    return sum + 3 + Math.min(cap, p.lines.length) + (hidden > 0 ? 1 : 0);
  }, 0);
  return Math.min(24, 6 + partRows);
}

function drawPart(t, part, i, cap) {
  const { Box, Text } = t;
  const shown = part.lines.slice(0, cap);
  const hidden = part.lines.length - shown.length + (part.more ?? 0);
  const list = shown.map((line, k) => Text({ key: `l${k}`, children: `  ${line}`, wrap: "truncate-end" }));
  if (hidden > 0) {
    list.push(Text({ key: "more", dimColor: true, children: `  + ${hidden} more` }));
  }
  return Box({
    key: `part${i}`,
    flexDirection: "column",
    marginTop: 1,
    children: [
      Text({ key: "sum", children: [Text({ dimColor: true, children: "Would    " }), Text({ color: "red", bold: true, children: part.summary })] }),
      Box({ key: "list", flexDirection: "column", children: list }),
      part.note ? Text({ key: "note", dimColor: true, italic: true, children: part.note, wrap: "wrap" }) : null,
    ],
  });
}

function draw(t, state) {
  const { Box, Text, Button } = t;
  const { report } = state;
  const cap = listCap(report);
  // The buttons answer the call this pane was drawn for, never whichever one is held now.
  const decide = (choice) => () => {
    if (state.decision === null) {
      state.decision = choice;
    }
  };
  return Box({
    flexDirection: "column",
    borderStyle: "round",
    borderColor: "yellow",
    paddingX: 1,
    children: [
      Text({ key: "title", bold: true, color: "yellow", children: `⚠ Blast Radius · ${state.risks.map((r) => r.label).join(" + ")}`, wrap: "truncate-end" }),
      Text({ key: "cmd", children: [Text({ dimColor: true, children: "Command  " }), Text({ bold: true, children: state.command })], wrap: "truncate-end" }),
      ...report.parts.map((part, i) => drawPart(t, part, i, cap)),
      Box({
        key: "buttons",
        marginTop: 1,
        gap: 2,
        children: [
          Button({ key: "proceed", label: "Proceed", hotkey: "1", plain: true, onPress: decide("proceed") }),
          Button({ key: "cancel", label: "Cancel", hotkey: "2", plain: true, autoFocus: true, onPress: decide("cancel") }),
          Text({ key: "hint", dimColor: true, children: "Claude is waiting on your answer" }),
        ],
      }),
    ],
  });
}
