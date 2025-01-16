import MapBlocks from "./MapBlocks";

export default {
  generate(treeRootsName) {
    // Retrieve Tree root objects from the session storage.
    const treeRoots = JSON.parse(window.sessionStorage.getItem(treeRootsName));

    /*
     * List of block that require additional handling.
     * The blocks below contain multiple fields that need to handled separately.
     */
    const nested_blocks = [
      "if %b %c",
      "if %b %c else %c",
      "forever %c",
      "repeat %n %c",
      "repeat until %b %c",
      "%n + %n",
      "%n − %n",
      "%n × %n",
      "%n / %n",
      "%n mod %n",
      "%n power %n",
      "%s < %s",
      "%s = %s",
      "%s > %s",
      "%b and %b",
      "%b or %b",
      "not %b",
    ];

    let finalString = ""; // final string with user state.
    let value = "";
    let isNestedBlock = false; // flag to determine if a block has Nested capabilities.

    /*
     * Child elements of a single nested block.
     * ex: (x>y)
     * Here x and y are nested child elements for the nested block "greater than"(>).
     * */
    let nested_children = []; // child elements of a single nested block
    let rootCounter = 0; // counting the number of root blocks being nested.

    /*
     * Nested root blocks of a multiple nested block
     * ex: if((x>y) and (z>a)){
     *         a = b;
     *     }
     * Here 1.x>y, 2.z>a and 3.a=b are nested root children
     * which have nested children of their own.
     * */
    let children = [];

    /*
     * Looping over the multiple tree roots that exist on the NetsBlox canvas.
     * parse the tree roots and generate the user state in text.
     * */
    for (let root of treeRoots) {
      // Initialize or reset variables.
      isNestedBlock = false;
      nested_children = [];
      rootCounter = 0;
      children = [];
      // parse tree root.
      parseBlocks(root);
      finalString += "\n";
    }

    /*
     * Adding brackets to match the syntax required for the agent.
     * Any additional decorations can be added here.
     */
    function decorate(block) {
      return "[" + block + "]";
    }

    /*
     * Apply nested children to the nested blocks.
     * The method replaces the placeholders in the nested block with the items in the nested children list.
     * ex: nestedChildren = ["x", "y"] and the nested block is %n > %v. Result : x > y.
     * */
    function replaceVariables(block, value) {
      let directional_blocks = ["%clockwise", "%counterclockwise"];
      let AdditionalVariables = false;
      let updatedBlock = "";
      if (block.includes("%")) {
        let blockList = block.split(" ");
        blockList.forEach((element, index) => {
          if (element.includes("%")) {
            if (!AdditionalVariables && !directional_blocks.includes(element)) {
              element = "(" + value + ")";
              AdditionalVariables = true;
            } else if (directional_blocks.includes(element)) {
              element = element.replace("%", "");
            }
            updatedBlock += element + " ";
          } else if (index === blockList.length - 1) {
            updatedBlock += element;
          } else {
            updatedBlock += element + " ";
          }
        });
        return updatedBlock;
      }
    }

    /*
     * Apply nested root block children to the multiple nested block.
     * The method replaces the placeholders in the nested block with the items in the children list.
     * ex: children = ["(x > y) and (d > r)", "(set a = b)"] and the multiple nested block is if %c %n.
     * Result: if (x > y) (and) (d > r)
     *                (set a = b)
     * */
    function AssignNestedChildren(root, children) {
      let rootList = root.split(" ");
      let childCounter = 0;
      let updatedRoot = "";
      rootList.forEach((element) => {
        if (element.includes("%")) {
          if (root.includes("if") & (childCounter === 0)) {
            element = children[childCounter];
            updatedRoot = decorate(updatedRoot + element.trim()) + "\n";
            childCounter++;
          } else if (root.includes("if") && childCounter === 1) {
            element = "\t" + decorate(children[childCounter]);
            updatedRoot += element;
            childCounter++;
          } else {
            if (children[childCounter].includes("(")) {
              element = children[childCounter];
            } else {
              element = "(" + children[childCounter] + ")";
            }

            updatedRoot += element.trim() + " ";
            childCounter++;
          }
        } else if (
          ["and", "or", "+", "−", "+", "×", "/", ">"].includes(element)
        ) {
          updatedRoot += "(" + element + ") ";
        } else {
          updatedRoot += element + " ";
        }
      });
      return updatedRoot;
    }

    /*
     * Main method to pasrse the tree elements into the textual user state.
     * The method can be used recursively to process nested nodes.
     * input: tree root node object.
     * output: user state for a single tree root.
     * */
    function parseBlocks(node) {
      let rootName = "";
      if (node.id) {
        rootName = MapBlocks.get(node.name);
        if (nested_blocks.includes(rootName)) {
          isNestedBlock = true;
          rootCounter++;
          if (nested_children.length > 0) {
            children = [...children, ...nested_children];
            nested_children = [];
          }
        }
      }
      if (node.next.contained.length !== 0) {
        for (let nextNode of node.next.contained) {
          if (nextNode) {
            if (!nextNode.id) {
              value = nextNode.name ? nextNode.name : "no value";
              if (rootCounter > 1) {
                nested_children.push(value);
              } else {
                rootName = replaceVariables(rootName, value);
              }
            } else {
              if (!isNestedBlock) {
                if (!nested_blocks.includes(MapBlocks.get(nextNode.name))) {
                  finalString += decorate(rootName);
                }
              }
              parseBlocks(nextNode);
            }
          }
        }
        if (nested_children.length > 0 && nested_blocks.includes(rootName)) {
          let updatedRootName = AssignNestedChildren(rootName, nested_children);
          rootCounter--;
          if (rootCounter === 0) {
            if (updatedRootName.includes("if")) {
              finalString += updatedRootName + "\n";
            } else {
              finalString += decorate(updatedRootName) + "\n";
            }
          } else {
            children.push(updatedRootName);
          }
          nested_children = [];
        } else if (rootCounter === 1) {
          if (nested_blocks.includes(rootName)) {
            finalString += AssignNestedChildren(rootName, children) + "\n";
            children = [];
            rootCounter--;
          } else if (nested_children.length > 0) {
            nested_children.push(rootName);
          } else if (rootName.includes("no value")) {
            if (rootName.includes("%c")) {
              rootName = rootName.replaceAll("%c", "(no value)");
            }
            finalString += rootName + "\n";
          } else {
            children.push(rootName);
          }
        } else if (rootCounter > 1) {
          if (children.length > 0 && rootName.includes("%")) {
            nested_children.push(
              AssignNestedChildren(rootName, children) + "\n"
            );
            children = [];
          } else if (nested_children.length > 0) {
            nested_children.push(rootName);
          } else {
            children.push(rootName);
          }

          rootCounter--;
        } else {
          if (children.length > 0) {
            finalString += AssignNestedChildren(rootName, children) + "\n";
            children = [];
          } else {
            if (rootName.includes("if")) {
              finalString += rootName + "\n";
            } else {
              finalString += decorate(rootName) + "\n";
            }
          }
        }
      } else {
        if (rootName.includes("%")) {
          rootName = rootName.replace("%", "");
        }
        if (isNestedBlock) {
          nested_children.push(rootName);
        } else {
          if (rootName.includes("if")) {
            finalString += rootName + "\n";
          } else {
            finalString += decorate(rootName) + "\n";
          }
        }
        // here is where the last blocks are printed.
      }

      if (node.next.next) {
        parseBlocks(node.next.next);
      }
    }

    return finalString;
  },
};
