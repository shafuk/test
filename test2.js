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
        if (index === word.length) { // 判断是否到达单词结尾
            if (!node.isEnd) return false; // 如果该节点不是单词结尾，返回false表示该单词不存在
            node.isEnd = false; // 将该节点的isEndOfWord属性设为false表示删除单词成功
            return Object.keys(node.children).length === 0; // 如果该节点没有任何子节点，则可以将该节点从父节点的子节点集合中删除
        }
        const char = word.charAt(index);
        if (!node.children[char]) return false; // 如果字典树中不存在对应的字符，则返回false表示该单词不存在
        const shouldDeleteNode = this._delete(node.children[char], word, index + 1);
        if (shouldDeleteNode) { // 如果需要删除当前节点
            delete node.children[char]; // 将该节点从父节点的子节点集合中删除
            return Object.keys(node.children).length === 0; // 如果该节点没有任何子节点，则可以将该节点从父节点的子节点集合中删除
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