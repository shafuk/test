
class LeafNode {
    constructor(key, value) {
      this.type = 'Leaf';
      this.key = key;
      this.value = value;
    }
  }
  
  class ExtensionNode {
    constructor(key, next) {
      this.type = 'Extension';
      this.key = key;
      this.next = next;
    }
  }
  
  class BranchNode {
    constructor() {
      this.type = 'Branch';
      this.children = Array(16).fill(null);
    }
  }
  
  class MPT {
    constructor() {
      this.root = new BranchNode();
    }
  
    static hash(key) {
        const Web3 = require('web3');
        const web3 = new Web3();
      return web3.utils.sha3(key);
    }
  
    addOrUpdate(key, value) {
      let node = this.root;
      let keyHash = MPT.hash(key);
  
      for (let i = 0; i < keyHash.length; i += 2) {
        let nibble = (keyHash[i] << 4) | keyHash[i + 1];
  
        if (node.type === 'Leaf') {
          if (node.key === key) {
            node.value = value;
          } else {
            let newNode = new BranchNode();
            let oldKeyHash = MPT.hash(node.key);
  
            for (let j = 0; j < oldKeyHash.length; j += 2) {
              let oldNibble = (oldKeyHash[j] << 4) | oldKeyHash[j + 1];
  
              if (j === oldKeyHash.length - 2) {
                newNode.children[oldNibble] = node;
              } else {
                newNode.children[oldNibble] = new ExtensionNode(oldKeyHash.slice(j + 2), node);
                node = newNode.children[oldNibble];
              }
            }
  
            node = newNode;
            this.root = node;
            i -= 2;
          }
        } else if (node.type === 'Extension') {
          let commonPrefix = node.key;
          let j = 0;
  
          while (commonPrefix[j] === keyHash[i + j] && j < commonPrefix.length) {
            j++;
          }
  
          if (j === commonPrefix.length) {
            node.next = this.addOrUpdate(key.slice(commonPrefix.length), value);
          } else {
            let newNode = new BranchNode();
            newNode.children[commonPrefix[j]] = node.next;
            node.next = newNode;
            node.key = commonPrefix.slice(0, j);
            newNode.children[keyHash[i + j]] = new LeafNode(key.slice(commonPrefix.length), value);
          }
        } else if (node.type === 'Branch') {
          if (node.children[nibble] === null) {
            node.children[nibble] = new LeafNode(key, value);
          } else {
            node.children[nibble] = this.addOrUpdate(key, value);
          }
        }
      }
  
      return node;
    }
  
    verify(key, balance) {
      let node = this.root;
      let keyHash = MPT.hash(key);
  
      for (let i = 0; i < keyHash.length; i += 2) {
        let nibble = (keyHash[i] << 4) | keyHash[i + 1];
  
        if (node.type === 'Leaf') {
          if (node.key === key) {
            return node.value.balance === balance;
          } else {
            return false;
          }
        } else if (node.type === 'Extension') {
          let commonPrefix = node.key;
          let j = 0;
  
          while (commonPrefix[j] === keyHash[i + j] && j < commonPrefix.length) {
            j++;
          }
  
          if (j === commonPrefix.length) {
            node = node.next;
          } else {
            return false;
          }
        } else if (node.type === 'Branch') {
          node = node.children[nibble];
  
          if (node === null) {
            return false;
          }
        }
      }
  
      return false;
    }
  }
  