#!/usr/bin/env bash
# Claude Code status line — robbyrussell base + visual context bar, threshold colors, icons

input=$(cat)

# Directory (basename of cwd)
cwd=$(echo "$input" | jq -r '.workspace.current_dir // .cwd // ""')
dir=$(basename "$cwd")

# Git branch (skip optional locks)
git_branch=""
if git -C "$cwd" rev-parse --git-dir > /dev/null 2>&1; then
  git_branch=$(git -C "$cwd" -c core.hooksPath=/dev/null symbolic-ref --short HEAD 2>/dev/null \
    || git -C "$cwd" rev-parse --short HEAD 2>/dev/null)
fi

# Git dirty state
git_dirty=""
if [ -n "$git_branch" ]; then
  if ! git -C "$cwd" diff --quiet 2>/dev/null || ! git -C "$cwd" diff --cached --quiet 2>/dev/null; then
    git_dirty=1
  fi
fi

# Session data
model=$(echo "$input" | jq -r '.model.display_name // ""')
output_style=$(echo "$input" | jq -r '.output_style.name // empty')
remaining=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty')
used_tokens=$(echo "$input" | jq -r '.context_window.total_input_tokens // empty')
window_size=$(echo "$input" | jq -r '.context_window.context_window_size // empty')
rate_5h=$(echo "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty')
rate_7d=$(echo "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty')
cost=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# ANSI colors
GREEN='\033[1;32m'
CYAN='\033[0;36m'
BLUE='\033[1;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
MAGENTA='\033[0;35m'
DIM='\033[2;37m'
RESET='\033[0m'

# Pick a color by percentage with custom thresholds.
# args: value good_max ok_max  (value <= good_max => green, <= ok_max => yellow, else red)
color_for() {
  local v=$1 good=$2 ok=$3
  if [ "$(printf '%.0f' "$v")" -le "$good" ]; then
    printf '%b' "$GREEN"
  elif [ "$(printf '%.0f' "$v")" -le "$ok" ]; then
    printf '%b' "$YELLOW"
  else
    printf '%b' "$RED"
  fi
}

# Render a 10-segment bar for a 0-100 value, colored by remaining (more = greener)
bar_for() {
  local pct=$1
  local filled=$(( ($(printf '%.0f' "$pct") + 5) / 10 ))
  [ "$filled" -lt 0 ] && filled=0
  [ "$filled" -gt 10 ] && filled=10
  local empty=$(( 10 - filled ))
  local col
  if [ "$filled" -ge 5 ]; then
    col=$GREEN
  elif [ "$filled" -ge 3 ]; then
    col=$YELLOW
  else
    col=$RED
  fi
  local b="" i=0
  while [ "$i" -lt "$filled" ]; do b="${b}▰"; i=$((i+1)); done
  local bar_filled="${col}${b}${RESET}"
  b=""; i=0
  while [ "$i" -lt "$empty" ]; do b="${b}▱"; i=$((i+1)); done
  printf '%b%b%b' "$bar_filled" "$DIM" "$b"
}

# Humanize a token count: 15500 -> 16k, 1500000 -> 1.5M
humanize() {
  local n=$1
  if [ "$n" -ge 1000000 ]; then
    printf '%s.%sM' "$((n / 1000000))" "$(( (n % 1000000) / 100000 ))"
  elif [ "$n" -ge 1000 ]; then
    printf '%sk' "$(( (n + 500) / 1000 ))"
  else
    printf '%s' "$n"
  fi
}

SEP="${DIM}│${RESET}"

# Prompt: green arrow + cyan dir
arrow="${GREEN}➜${RESET}"
dir_part="${CYAN}${dir}${RESET}"

# Git info
git_part=""
if [ -n "$git_branch" ]; then
  if [ -n "$git_dirty" ]; then
    git_part=" ${BLUE}git:(${RED}${git_branch}${BLUE})${RESET} ${YELLOW}✗${RESET}"
  else
    git_part=" ${BLUE}git:(${RED}${git_branch}${BLUE})${RESET}"
  fi
fi

# Meta segments, joined by separators
segments=()
[ -n "$model" ] && segments+=("${MAGENTA}✦ ${model}${RESET}")
[ -n "$output_style" ] && segments+=("${DIM}❖ ${output_style}${RESET}")
if [ -n "$remaining" ]; then
  rem_int=$(printf '%.0f' "$remaining")
  if [ "$rem_int" -ge 50 ]; then ctx_col=$GREEN
  elif [ "$rem_int" -ge 25 ]; then ctx_col=$YELLOW
  else ctx_col=$RED; fi
  if [ -n "$used_tokens" ] && [ -n "$window_size" ] && [ "$window_size" -gt 0 ]; then
    ctx_label="$(humanize "$used_tokens")/$(humanize "$window_size")"
  else
    ctx_label="${rem_int}%"
  fi
  segments+=("$(bar_for "$remaining")${RESET} ${ctx_col}${ctx_label}${RESET}")
fi
[ -n "$rate_5h" ] && segments+=("$(color_for "$rate_5h" 60 85)◷ 5h $(printf '%.0f' "$rate_5h")%${RESET}")
[ -n "$rate_7d" ] && segments+=("$(color_for "$rate_7d" 60 85)◷ 7d $(printf '%.0f' "$rate_7d")%${RESET}")
segments+=("${GREEN}\$$(printf '%.2f' "$cost")${RESET}")

meta_part=""
for seg in "${segments[@]}"; do
  if [ -z "$meta_part" ]; then
    meta_part=" ${seg}"
  else
    meta_part="${meta_part} ${SEP} ${seg}"
  fi
done

printf "%b %b%b%b" "$arrow" "$dir_part" "$git_part" "$meta_part"
