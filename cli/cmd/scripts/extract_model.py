import os
import json
import sys
import numpy as np
from safetensors.numpy import save_file as save_np_st

try:
    import torch
    from safetensors.torch import save_file as save_torch_st
except:
    torch = None

try:
    import tensorflow as tf
except:
    tf = None

try:
    import onnx
    import onnx.numpy_helper as onp
except:
    onnx = None


def is_pytorch(p):
    return p.endswith((".pt", ".pth", ".bin")) and torch

def is_tensorflow_or_keras(p):
    if tf is None:
        return False
    if os.path.isdir(p):
        return True
    if p.endswith((".h5", ".keras")):
        return True
    return False

def is_onnx(p):
    return p.endswith(".onnx") and onnx

def is_safetensors(p):
    return p.endswith(".safetensors")


def extract_pytorch(path):
    ckpt = torch.load(path, map_location="cpu")

    print(ckpt)

    if isinstance(ckpt, dict) and "state_dict" in ckpt:
        sd = ckpt["state_dict"]
        tensors = {k: v for k, v in sd.items() if torch.is_tensor(v)}
        meta = {k: ckpt[k] for k in ckpt if k != "state_dict"}
    elif isinstance(ckpt, dict) and all(torch.is_tensor(v) for v in ckpt.values()):
        tensors = ckpt
        meta = {}
    else:
        tensors = {k: v for k, v in ckpt.items() if torch.is_tensor(v)}
        meta = {k: v for k, v in ckpt.items() if not torch.is_tensor(v)}

    save_torch_st(tensors, "weights.safetensors")

    clean = {}
    for k, v in meta.items():
        try:
            json.dumps(v)
            clean[k] = v
        except:
            clean[k] = str(v)

    json.dump(clean, open("metadata.json", "w"), indent=2)
    json.dump({"type": "pytorch", "tensor_keys": list(tensors.keys())}, open("architecture.json", "w"), indent=2)


def extract_tensorflow_or_keras(path):
    model = tf.keras.models.load_model(path)
    weights = {}
    weight_keys = []
    for i, w in enumerate(model.weights):
        k = f"{i}/{w.name.replace(':0','')}"
        weights[k] = w.numpy()
        weight_keys.append(k)
    save_np_st(weights, "weights.safetensors")
    meta = {"training_config": model.get_config()}
    json.dump(meta, open("metadata.json", "w"), indent=2)
    json.dump({"type": "keras", "architecture": model.to_json(), "weight_keys": weight_keys}, open("architecture.json", "w"), indent=2)


def extract_onnx(path):
    m = onnx.load(path)
    tensors = {}
    for init in m.graph.initializer:
        tensors[init.name] = onp.to_array(init)
    save_np_st(tensors, "weights.safetensors")
    meta = {"opset": m.opset_import[0].version}
    json.dump(meta, open("metadata.json", "w"), indent=2)
    json.dump({"type": "onnx", "onnx_path": path}, open("architecture.json", "w"), indent=2)


def extract_safetensors(path):
    os.system(f"cp '{path}' weights.safetensors")
    json.dump({"info": "direct_safetensors"}, open("metadata.json", "w"), indent=2)
    json.dump({"type": "safetensors"}, open("architecture.json", "w"), indent=2)


if __name__ == "__main__":
    p = sys.argv[1]
    if is_pytorch(p):
        extract_pytorch(p)
    elif is_tensorflow_or_keras(p):
        extract_tensorflow_or_keras(p)
    elif is_onnx(p):
        extract_onnx(p)
    elif is_safetensors(p):
        extract_safetensors(p)
    else:
        print("unsupported")
        sys.exit(1)
    print("ok")
