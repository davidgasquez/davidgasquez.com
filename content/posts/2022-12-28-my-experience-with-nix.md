---
title: "My little and short experience with Nix"
date: 2022-12-28
---

NixOS has somehow slowly gotten into all my feeds. So, after getting a new AMD GPU (Radeon 7900 XTX), I took the opportunity to install NixOS on my main desktop PC. This blog is to share how it played out.

After creating the USB installation media and installing NixOS, I quicly ran into the first issue. The new GPU is too recent for drivers to be available so... a black screen is all I got. In Arch Linux, I had to upgrade to `linux-firmware-git`  and compile `mesa-git`  against the  `llvm-git` package. I spent a couple of afternoons trying to figure out how to do the same on NixOS unsuccessfully. After all, I had no idea about Nix the language (only [skimmed the manual](https://nixos.org/manual/nix/stable/introduction.html)) or NixOS the OS besides a couple of trivial `configuration.nix` changes.

I decided to pivot and focus on learning Nix. The plan was to slowly migrate my [dotfiles repository](https://github.com/davidgasquez/dotfiles) to be fully managed by Home Manager and Nix Flakes. Tried to read a bit about how these two tools work but the documentation and [wiki](https://nixos.wiki/wiki/Main_Page) weren't as helpful as I was expecting. I started reading open source GitHub `nixos-config` repositories ([1](https://github.com/mitchellh/nixos-config), [2](https://github.com/selfuryon/nixos-config), [3](https://github.com/Ashe/dotfiles/tree/master)) to get a sense of the language syntax and some ~~best~~ [common practices](https://nix.dev/tutorials/dev-environment).

Without much hassle and [a helpful template](https://github.com/Misterio77/nix-starter-configs/tree/main/standard) I used as inspiration, figured out how to setup a Nix Flake taking care of these things:

- Installing some `user` level packages (`code`, `bat`, ...).
- Replacing my current`.gitconfig` with a _Nixed_ one.
- Use the `unstable` packages branch and auto-format all the configurations with `nixpkgs-fmt`.

![my nix setup](https://i.ibb.co/k4mDY2v/1672235999.png)

I was very excited about the progress. I briefly explored [`devenv`](https://github.com/cachix/devenv) and [`direnv` with VS Code](https://marketplace.visualstudio.com/items?itemName=mkhl.direnv) but couldn't figure out how to integrate `devenv` with the Flake I was creating and wasn't sure it would be much better.

Christmas came though. Didn't touch Nix in a couple of days and... my motivation faded away. That's it. I couldn't get myself into tinker with Nix. This are the reasons I came up to justify it:

1. **Development environments are moving to Docker**. I've been a power user of `.devcontainers` and `Dockerfile` based development environments ([which they can also be generated with Nix](https://devenv.sh/integrations/codespaces-devcontainer/)). They're not perfect but works week for 95% of the projects I work on. Also, other people in my organization can understand them.
2. **My `dotfiles` are already somewhat declarative**. Take a look at my [`vscode`](https://github.com/davidgasquez/dotfiles/tree/main/vscode) configuration; all the required bits to reproduce the state I like vscode to be are there. For this use case, I don't think I need another leaky (and probably not as complete as the tool defaults) abstraction.
3. I work as a data engineer. Only have 2 machines. Perhaps **Nix is overkill for someone in my position**?

On the other hand, Nix did something to my brain. I can't stop thinking about how elegant the idea is. Replace Docker, `npn`, `conda`, Make, and every other tool. Let it all be in Nix, the one tool to rule them all. I'm sure I'll come back to it in the future and, meanwhile, I'll be following the development up close!

For now, this was a fun time-constrained skirmish with it. Lessons learned!
