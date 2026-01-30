import json
import sys
import os
import numpy as np
from safetensors.numpy import load_file as load_np_st

try:
    import torch
    from safetensors.torch import load_file as load_torch_st
except:
    torch = None

try:
    import tensorflow as tf
except:
    tf = None

try:
    import onnx
except:
    onnx = None


if len(sys.argv) != 5:
    print("usage: python rebuild.py <weights.safetensors> <architecture.json> <metadata.json> <output_file>")
    sys.exit(1)

W_PATH = sys.argv[1]
A_PATH = sys.argv[2]
M_PATH = sys.argv[3]
OUT_FILE = sys.argv[4]


def rebuild_pytorch():
    arch = json.load(open(A_PATH))
    meta = json.load(open(M_PATH))
    tensor_keys = arch["tensor_keys"]

    w = load_torch_st(W_PATH)

    # Rebuild state_dict exactly as extracted
    state_dict = {k: w[k] for k in tensor_keys}

    out = {"state_dict": state_dict}
    out.update(meta)

    torch.save(out, OUT_FILE)
    print("ok:", OUT_FILE)


def rebuild_keras():
    arch = json.load(open(A_PATH))
    meta = json.load(open(M_PATH))

    model_json = arch["architecture"]
    weight_keys = arch["weight_keys"]

    model = tf.keras.models.model_from_json(model_json)
    w = load_np_st(W_PATH)

    for t, k in zip(model.weights, weight_keys):
        t.assign(w[k])

    model.save(OUT_FILE)
    print("ok:", OUT_FILE)


def rebuild_onnx():
    arch = json.load(open(A_PATH))
    meta = json.load(open(M_PATH))

    model = onnx.load(arch["onnx_path"])
    w = load_np_st(W_PATH)

    for init in model.graph.initializer:
        init.raw_data = w[init.name].tobytes()

    onnx.save(model, OUT_FILE)
    print("ok:", OUT_FILE)


def rebuild_safetensors():
    os.system(f"cp '{W_PATH}' '{OUT_FILE}'")
    print("ok:", OUT_FILE)


if __name__ == "__main__":
    t = json.load(open(A_PATH))["type"]

    if t == "pytorch" and torch:
        rebuild_pytorch()
    elif t == "keras":
        rebuild_keras()
    elif t == "onnx" and onnx:
        rebuild_onnx()
    elif t == "safetensors":
        rebuild_safetensors()
    else:
        print("unsupported")
