#!/usr/bin/env bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Installing Axiom CLI...${NC}"

# Detect OS and Architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}" in
    Linux*)     OS_NAME="Linux";;
    Darwin*)    OS_NAME="Darwin";;
    *)          echo -e "${RED}Unsupported OS: ${OS}${NC}"; exit 1;;
esac

case "${ARCH}" in
    x86_64)     ARCH_NAME="x86_64";;
    amd64)      ARCH_NAME="x86_64";;
    arm64)      ARCH_NAME="arm64";;
    aarch64)    ARCH_NAME="arm64";;
    *)          echo -e "${RED}Unsupported architecture: ${ARCH}${NC}"; exit 1;;
esac

# Fetch the latest release tag
echo "Fetching latest release information..."
LATEST_TAG=$(curl -s https://api.github.com/repos/aetosdios27/axiom-core/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$LATEST_TAG" ]; then
    echo -e "${RED}Failed to fetch the latest release tag. Are you rate-limited by GitHub API?${NC}"
    exit 1
fi

echo "Found latest version: ${LATEST_TAG}"

TAR_FILE="axiom_${OS_NAME}_${ARCH_NAME}.tar.gz"
DOWNLOAD_URL="https://github.com/aetosdios27/axiom-core/releases/download/${LATEST_TAG}/${TAR_FILE}"

# Create temp directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

echo "Downloading ${DOWNLOAD_URL}..."
curl -sL -o "${TAR_FILE}" "${DOWNLOAD_URL}"

if [ ! -f "${TAR_FILE}" ]; then
    echo -e "${RED}Download failed.${NC}"
    exit 1
fi

tar -xzf "${TAR_FILE}" axiom

INSTALL_DIR="/usr/local/bin"
LOCAL_INSTALL_DIR="$HOME/.axiom/bin"
BINARY_DEST=""

# Try to install to /usr/local/bin
if [ -w "$INSTALL_DIR" ]; then
    mv axiom "$INSTALL_DIR/axiom"
    BINARY_DEST="$INSTALL_DIR/axiom"
else
    if command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
        sudo mv axiom "$INSTALL_DIR/axiom"
        BINARY_DEST="$INSTALL_DIR/axiom"
    fi
fi

# Fallback to ~/.axiom/bin if /usr/local/bin failed
if [ -z "$BINARY_DEST" ]; then
    echo -e "${YELLOW}Falling back to local installation in ${LOCAL_INSTALL_DIR}...${NC}"
    mkdir -p "$LOCAL_INSTALL_DIR"
    mv axiom "$LOCAL_INSTALL_DIR/axiom"
    BINARY_DEST="$LOCAL_INSTALL_DIR/axiom"
    
    # Inject PATH
    PROFILE_FILES=("$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.bash_profile")
    for profile in "${PROFILE_FILES[@]}"; do
        if [ -f "$profile" ]; then
            if ! grep -q "$LOCAL_INSTALL_DIR" "$profile"; then
                echo -e "\nexport PATH=\"$LOCAL_INSTALL_DIR:\$PATH\"" >> "$profile"
                echo "Added $LOCAL_INSTALL_DIR to $profile"
            fi
        fi
    done

    FISH_CONFIG="$HOME/.config/fish/config.fish"
    if [ -f "$FISH_CONFIG" ]; then
        if ! grep -q "$LOCAL_INSTALL_DIR" "$FISH_CONFIG"; then
            echo -e "\nfish_add_path $LOCAL_INSTALL_DIR" >> "$FISH_CONFIG"
            echo "Added $LOCAL_INSTALL_DIR to $FISH_CONFIG"
        fi
    fi

    echo -e "${YELLOW}Please restart your shell or run: export PATH=\"$LOCAL_INSTALL_DIR:\$PATH\"${NC}"
fi

# Cleanup
cd - > /dev/null
rm -rf "$TMP_DIR"

echo -e "${GREEN}Successfully installed Axiom to ${BINARY_DEST}!${NC}"
echo -e "Run ${BLUE}axiom list${NC} to get started."
