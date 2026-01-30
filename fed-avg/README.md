# StackAI Federated Learning Prototype

A simple federated learning implementation using Flower (flwr) framework for collaborative model training and merging.

## 📁 Project Structure

```
fede/
├── model.py              # Neural network architecture (Net class)
├── client.py             # Flower client implementation
├── server.py             # Basic Flower server
├── server_with_save.py   # Server with model saving capability
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
python server_with_save.py
```

### 3. Run Clients (in separate terminals)
```bash
# Terminal 1
python client.py --client-id 0

# Terminal 2  
python client.py --client-id 1
```

## 📋 Files Description

### Core Files:
- **`model.py`**: Defines the neural network architecture (`Net` class) for MNIST classification
- **`client.py`**: Implements Flower client with data loading, training, and evaluation
- **`server.py`**: Basic Flower server using FedAvg strategy
- **`server_with_save.py`**: Enhanced server that saves merged models after each round

### Configuration:
- **`requirements.txt`**: Lists all required Python packages
- **`README.md`**: Project documentation and usage instructions

## 🔧 How It Works

1. **Server**: Coordinates federated learning rounds using FedAvg strategy
2. **Clients**: Train models locally on split MNIST data
3. **Aggregation**: Server averages model parameters from all clients
4. **Model Saving**: Final merged model is saved as `final_federated_model.pth`

## 📊 Expected Output

The server will show:
```
🏠 Starting Flower Server with Model Saving
🌐 Server address: 0.0.0.0:8080
🔄 Number of rounds: 5
💾 Models will be saved after each round and final model as 'final_federated_model.pth'
```

After completion:
```
💾 Saved federated model from round 1 to 'federated_model_round_1.pth'
💾 Saved federated model from round 2 to 'federated_model_round_2.pth'
...
🏆 Final federated model saved to 'final_federated_model.pth'
```

## 🎯 Key Features

- ✅ **Federated Learning**: Collaborative training without data sharing
- ✅ **Model Merging**: Automatic parameter averaging using FedAvg
- ✅ **Model Saving**: Saves intermediate and final merged models
- ✅ **MNIST Dataset**: Standard benchmark for testing
- ✅ **Flower Framework**: Production-ready federated learning

## 🔍 Troubleshooting

### Connection Issues
If clients can't connect to server:
1. Make sure server is running first
2. Check server address (default: `127.0.0.1:8080`)
3. Ensure no firewall blocking port 8080

### Model Saving Issues
If models aren't saved:
1. Use `server_with_save.py` (not `server.py`)
2. Check file permissions in current directory
3. Ensure PyTorch is properly installed

## 📈 Next Steps

This prototype demonstrates:
- Basic federated learning setup
- Model parameter aggregation
- Collaborative training workflow

For your StackAI project, you can extend this to:
- Multiple model architectures
- Advanced aggregation strategies
- Blockchain integration
- Token-based incentives
- Cross-repository merging
