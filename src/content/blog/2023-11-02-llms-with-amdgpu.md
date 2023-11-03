---
title: "Working with LLMs on AMDGPUs"
date: 2023-11-02
slug: llms-with-amdgpu
---

This might only work for a few months (or even days), but after spending a few hours trying to get an open source LLMs to work on AMDGPUs inside Docker, I thought I'd share my findings. My GPU is an AMD 7900 XTX, and I was only able to make it work with [the `llama-cpp` Python bindings](https://llama-cpp-python.readthedocs.io/en/latest/). This should work for any [ROCm supported AMDGPUs](https://rocm.docs.amd.com/en/latest/).

The first thing is to build and setup our Docker image. This is what I ended up with:

```dockerfile
FROM rocm/dev-ubuntu-22.04:5.7-complete

# Environment variables
ENV GPU_TARGETS=gfx1100
ENV LLAMA_HIPBLAS=1
ENV CC=/opt/rocm/llvm/bin/clang
ENV CXX=/opt/rocm/llvm/bin/clang++

# Install pytorch and llama-cpp-python
RUN pip3 install --pre torch --index-url https://download.pytorch.org/whl/nightly/rocm5.7
RUN CMAKE_ARGS="-DLLAMA_HIPBLAS=1 -DAMDGPU_TARGETS=gfx1100" pip3 install llama-cpp-python --force-reinstall --upgrade --no-cache-dir
```

You might need to change `gfx1100` to your GPU's family/target.

Next, we need to build the image:

```bash
docker build --no-cache -t amd-llm .
```

Now we can run the image with this ~complex~ precise command:

```bash

```bash
docker run -it --network=host --device=/dev/kfd \
    --device=/dev/dri --group-add=video --ipc=host \
    --cap-add=SYS_PTRACE --security-opt seccomp=unconfined \
    --entrypoint=bash \
    -v $(PWD):/models \
    amd-llm
```

This will mount the current directory to `/models` inside the container and get you into a bash shell. Now is time to check if the Pytorch installation is working and able to detect the GPU. These commands should work:

```python
import torch
print(torch.cuda.is_available())
print(torch.cuda.get_device_name(torch.cuda.current_device()))

print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
print(f"CUDA arch list: {torch.cuda.get_arch_list()}")
print(f"CUDNN available: {torch.backends.cudnn.is_available()}")
print(f"CUDNN version: {torch.backends.cudnn.version()}")

tensor = torch.randn(2, 2)
res = tensor.to(0)
```

If everything is working, you should see something like this:

```bash
True
Radeon RX 7900 XTX
CUDA available: True
CUDA version: None
CUDA arch list: ['gfx900', 'gfx906', 'gfx908', 'gfx90a', 'gfx1030', 'gfx1100']
CUDNN available: True
CUDNN version: 2020000
```

Now, let's do some LLMing and put those graphical processing units to work with one of the latest models, Mistral!

Download the model:

```bash
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf
```

And with that, we should be ready to run the model with `llama-cpp-python`:

```python
from llama_cpp import Llama

llm = Llama(
    model_path="mistral-7b-instruct-v0.1.Q4_K_M.gguf",
    n_gpu_layers=-1,
    main_gpu=1
)

output = llm(
    "Q: Name the planets in the solar system. A: ",
    max_tokens=2048,
    stop=["Q:", "\n"],
    echo=True,
)

print(output)
```

For me, it printed the following:

```json
{
   "id":"cmpl-f3887631-d106-43e8-97c0-5deee07dcd2f",
   "object":"text_completion",
   "created":1698995742,
   "model":"mistral-7b-instruct-v0.1.Q4_K_M.gguf",
   "choices":[
      {
         "text":"Q: Name the planets in the solar system. A: 1. Mercury, 2. Venus, 3. Earth, 4. Mars, 5. Jupiter, 6. Saturn, 7. Uranus, 8. Neptune",
         "index":0,
         "logprobs":"None",
         "finish_reason":"stop"
      }
   ],
   "usage":{
      "prompt_tokens":14,
      "completion_tokens":46,
      "total_tokens":60
   }
}
```

🎉 🎉 🎉

If you, like me, are wondering if the GPU was actually being used, you can install [nvtop](https://github.com/Syllo/nvtop) and execute it.

![GPU usage]([./gpu-usage.png](https://user-images.githubusercontent.com/1682202/280206444-6cbc9942-eb44-460f-a279-f80181847be0.png))

Finally, after a few hours and a bunch of tweaks, the GPU was using and Mistral 7B worked on my machine!
