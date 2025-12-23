# ╔═══════════════════════╗
# ║  🌈 ULTRA-MODERN ZSH  ║
# ╚═══════════════════════╝
# Core Terminal “OS” Config — Atomic, Modular, Hyper-Intelligent
# https://github.com/Q-T0NLY/world-class-cli

# PATH/ENV GUARD — ARCHITECTURE-AWARE, AUTO-ROLLBACK
export ZSH_OS_NAME="macOS"
export ZSH_OS_VER="$(sw_vers -productVersion)"
export ZSH_CPU_TYPE="$(uname -m)"
export ZSH_PLATFORM="intel"
if [[ "$ZSH_CPU_TYPE" == "arm64" ]]; then export ZSH_PLATFORM="apple-silicon"; fi

# 🟣 Quantum Profile Manager (ARC-V Snapshots)
ZSH_PROFILE_DIR="$HOME/.zsh_profiles"
ZSH_PROFILE_SNAP="$ZSH_PROFILE_DIR/last_good"
mkdir -p "$ZSH_PROFILE_DIR"
zsh_profile_snapshot() {
  cp ~/.zshrc ~/.zshrc_custom "$ZSH_PROFILE_SNAP" 2>/dev/null
}

restore_profile_snapshot() {
  cp "$ZSH_PROFILE_SNAP" ~/.zshrc ~/.zshrc_custom 2>/dev/null
  echo -e "🔄 Profiles rolled back! Please restart your shell."
}

# 🌟 Intelligent Zinit/OMZ Installer & Detector
function detect_or_install_zinit() {
  if [[ -d "${HOME}/.local/share/zinit/zinit.git" ]]; then
    echo "🔍 Zinit detected!"
    return
  elif [[ -d "${HOME}/.oh-my-zsh" ]]; then
    echo "🔍 Oh My Zsh detected!"
    return
  else
    echo -e "❓ Neither Zinit nor Oh My Zsh found.\n💡 Would you like to (I)nstall Zinit, (O)h My Zsh, or (S)kip? [I/O/S]"
    read -sk1 choice
    if [[ "$choice" =~ [iI] ]]; then
      echo "🏗️ Installing Zinit..."
      sh -c "$(curl -fsSL https://raw.githubusercontent.com/zdharma-continuum/zinit/gh-pages/doc/install.sh)"
    elif [[ "$choice" =~ [oO] ]]; then
      echo "🏗️ Installing Oh My Zsh..."
      sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    else
      echo "⚠️ Plugin manager skipped; some features will be disabled."
    fi
  fi
}
detect_or_install_zinit

# 🌐 Shell AI / Copilot CLI AI Tools
function detect_copilot_cli() {
  command -v github-copilot-cli >/dev/null 2>&1 && echo "🤖 Copilot CLI available!" && return
  echo -e "🤖 Copilot CLI not found.\n💡 Install Copilot CLI for smart command suggestions? [Y/n]"
  read -sk1 ccli
  if [[ "$ccli" =~ [yY] ]]; then
    npm install -g @githubnext/github-copilot-cli && echo "✅ Copilot CLI installed!"
  fi
}
detect_copilot_cli

# 🦄 Dracula/Powerlevel10k Rainbow Prompt
if [[ ! -d "${HOME}/.powerlevel10k" ]]; then
  echo "🖌️ Powerlevel10k theme not detected. Install? [Y/n]"
  read -sk1 p10k_c
  if [[ "$p10k_c" =~ [yY] ]]; then
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.powerlevel10k
  fi
fi
if [[ -d "${HOME}/.powerlevel10k" ]]; then
  export ZSH_THEME="powerlevel10k/powerlevel10k"
  source ~/.powerlevel10k/powerlevel10k.zsh-theme
fi

# 🏗️ Load Plugin Manager
if [[ -d "${HOME}/.local/share/zinit/zinit.git" ]]; then
  source "${