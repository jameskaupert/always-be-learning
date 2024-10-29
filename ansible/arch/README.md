# Ansible Arch Linux Setup
My playground for trying things out before they make it into my setup repo.

# Usage
1. Install Ansible: `sudo pacman -Sy ansible`
2. From this folder, run `ansible-playbook playbook.yml -K`
3. Update `/etc/mkinitpcio.conf` to ensure MODULES contains the following so Hyprland + Wayland + NVIDIA play nice
`MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)`
4. Run `sudo mkinitcpio -P` and fix any errors
