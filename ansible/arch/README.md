# Ansible Arch Linux Setup
My playground for trying things out before they make it into my setup repo.

# Usage
1. Install yay (I had issues getting this to work using Ansible): `sudo pacman -S --needed git base-devel && git clone https://aur.archlinux.org/yay.git && cd yay && makepkg -si`
2. Install Ansible: `sudo pacman -Sy ansible`
3. From this folder, run `ansible-playbook playbook.yml -K`
4. Update `/etc/mkinitpcio.conf` to ensure MODULES contains the following so Hyprland + Wayland + NVIDIA play nice
`MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)`
5. Run `sudo mkinitcpio -P` and fix any errors
6. Install Da Vinci Resolve (not able to figure out the Ansible):
`yay davinci-resolve-studio`
  - Required packages:
    - opencl-nvidia
7. Permissions fix for license file: `sudo chown $USER:$GROUP /opt/resolve/.license`
