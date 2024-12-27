---
title: "Debugging Dagster in VSCode"
date: 2024-12-27
slug: debug-dagster-vscode
---

I haven't used a debugger probably since my first year of college working with C++. I've been coding in Notebook heavy environments since I switched to Python. That said, working with something like Dagster has been tricky as I had to copy paste a lot of code and the state can be hard to track.

I've spent some time trying to setup a nice experience for Dagster in VSCode/Cursor. And I think I've found a solution that works well enough!

## Python Debugging

The Python extension supports debugging through a `launch.json` file. This file can be used to configure the debugger to run a module and other settings, like launching the browser once Dagster is running.

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Dagster",
            "type": "debugpy",
            "request": "launch",
            "module": "dagster",
            "args": [
                "dev",
            ],
            "subProcess": true,
            "serverReadyAction": {
                "pattern": "Serving dagster-webserver",
                "uriFormat": "http://127.0.0.1:3000",
                "action": "openExternally"
            },
        }
    ]
}
```

Save this file in the root of your Dagster project and hit F5 to start the debugger. The browser will open and you'll be able to see the Dagster UI!

## Dagster Debugging

Now, you can start debugging your Dagster assets or resources. Add a breakpoint in your code and then trigger an asset or resource from the UI. The debugger **will** pause at the breakpoint and you'll be able to see the state of the world at that point in time.

You can also jump into the debugging console and run arbitrary Python code. This is useful for not so small things like inspecting the data returned from an API, checking out a DataFrame transformation, or running a SQL query with a database resource.

You can work from your file and send things to the debugger console with this keybinding.

```json
{
  "key": "shift+alt+d",
  "command": "editor.debug.action.selectionToRepl"
}
```
