class TreeNode{
    constructor() {
        this.children=[]
        this.isEnd=false
    }
}
class Tree{
    constructor() {
        this.root=new TreeNode()
    }
    search(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word.charAt(i);
            if (!node.children[char]) {
                return false;
            }
            node = node.children[char];
        }
        return node.isEnd;
    }
    insert(word){
        let node = this.root
        for (let i = 0; i < word.length; i++) {
            const char = word.charAt(i)
            if (!node.children[char]){
                node.children[char]=new TreeNode()
            }
            node=node.children[char]
        }
        node.isEnd=true
    }
    delete(word) {
        this._delete(this.root, word, 0);
    }

    _delete(node, word, index) {
        if (index === word.length) {
            if (!node.isEnd) return false;
            node.isEnd = false;
            return Object.keys(node.children).length === 0;
        }
        const char = word.charAt(index);
        if (!node.children[char]) return false;
        const shouldDeleteNode = this._delete(node.children[char], word, index + 1);
        if (shouldDeleteNode) {
            delete node.children[char];
            return Object.keys(node.children).length === 0;
        }
        return false;
    }
}
function main(){
    const tree = new Tree();
    tree.insert('apple');
    console.log(tree.search('apple'));
    tree.delete('apple');
    console.log(tree.search('apple'));
}
main()