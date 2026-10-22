# Apps and CLIs for `brew bundle`. chezmoi sets HOMEBREW_WHYSTACK_PROFILE,
# because Homebrew passes only HOMEBREW_* variables to this file.
profile = ENV.fetch("HOMEBREW_WHYSTACK_PROFILE", "personal")

# Taps
tap "heroku/brew", trusted: { formulae: ["heroku-node"] }
tap "homebrew/services"
tap "mongodb/brew", trusted: { formulae: ["mongodb-database-tools"] }
tap "shopify/shopify", trusted: true
tap "supabase/tap"

# Core CLI
brew "git"
brew "git-lfs"
brew "gnupg"
brew "coreutils"
brew "gh"
brew "chezmoi"
brew "fzf"
brew "gpgme"
brew "unar"
brew "exiftool"
brew "lychee"
brew "yamllint"
brew "checkmake"
brew "lazymake"
brew "googleworkspace-cli"
brew "groff"
brew "docutils"
brew "doxygen", args: ["HEAD"]
brew "dpkg"
brew "heimdal"
brew "libiconv"
brew "libssh2"
brew "unbound"
brew "runit"
brew "putty"

# Languages and version managers
brew "mise"
brew "nvm"
brew "pyenv"
brew "pyenv-virtualenv"
brew "rbenv"
brew "uv"
brew "pipx"
brew "lerna"
brew "maven"

# Containers and Kubernetes
brew "colima"
brew "docker"
brew "docker-buildx"
brew "docker-compose"
brew "docker-credential-helper"
brew "lazydocker"
brew "oxker"

# Build tools for the Tauri and iOS apps
brew "cmake"
brew "cocoapods"
brew "xcodegen"
brew "libimobiledevice"

# Apps
cask "antigravity-cli"
cask "copilot-cli"
cask "gcloud-cli"
cask "ghostty"

# Rust tools
cargo "cargo-binstall"
cargo "cargo-deny"
cargo "cargo-llvm-cov"
cargo "cargo-machete"
cargo "cargo-nextest"
cargo "sqlx-cli"
cargo "tauri-cli"
cargo "trunk"
cargo "typos-cli"
cargo "zizmor"

# Node tools
npm "@higgsfield/cli"
npm "@openai/codex"
npm "corepack"

if profile == "personal"
  # Databases
  brew "postgresql@17"
  brew "mongosh"
  brew "mongodb/brew/mongodb-community", trusted: true
  brew "supabase/tap/supabase", trusted: true

  # Media
  brew "ffmpeg"
  brew "graphicsmagick"
  brew "libass"

  # Hosting
  brew "heroku/brew/heroku", trusted: true
  brew "shopify/shopify/shopify-cli", trusted: true
end

if profile == "work"
end
