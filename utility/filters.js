const treeByParent = (nodes, parentId) => {
	return nodes
		.filter(node => node.parent_id === parentId)
		.reduce(
			(tree, node) => [
				...tree,
				{
					...node,
					children: treeByParent(nodes, node.id)
				}
			],
			[]
		)
}

/**
 * * Create recursive tree
 */
const treeFromList = nodes => {
	const myMap = new Map(nodes.map(item => [item.id, item]))
	const tree = []
	for (let i = 0; i < nodes.length; i += 1) {
		const item = nodes[i]
		item.children = []

		if (item.parent_id) {
			const parentItem = myMap.get(item.parent_id)

			if (parentItem) {
				parentItem.children.push(item)
			}
		} else {
			tree.push(item)
		}
	}

	return tree
}
module.exports = {
	treeFromList,
	treeByParent
}
