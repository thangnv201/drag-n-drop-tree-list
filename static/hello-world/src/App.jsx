import React, {useState} from "react";
import {requestJira} from "@forge/bridge";
import {Tree} from "rsuite";

const styles = {
    padding: 20, textAlign: "center",
};

const issueLinkName = `blocks`;
const data = async () => {
    const params = `issueLinkType = "${issueLinkName}" or issueLinkType = null`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log('call api jira');
    return await response.json();
};

const issueData = data().then((result) => {
    let data = [];
    console.log(result)
    result.issues.forEach((element) => {
        data.push({
            label: element.key, value: element.key, visible: true,
        });
    });

    return data;
});

const createIssueLink = async (outwardIssue, inwardIssue) => {
    let body = `{
  "outwardIssue": {
    "key": "${outwardIssue}"
  },
  "inwardIssue": {
    "key": "${inwardIssue}"
  },
  "type": {
    "name": "Blocks"
  }
}`;
    const response = await requestJira(`/rest/api/2/issueLink`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: body
    });
    return response.status;
}
const App = () => {
    let [treeData, setTreeData] = useState();

    issueData.then((data) => {
        if (treeData === undefined) {
            setTreeData(data);
        }
    });
    console.log('reload plugin');
    return (
        <Tree
            height={900}
            data={treeData}
            draggable
            defaultExpandAll
            onDrop={({createUpdateDataFunction, dropNode, dragNode}, event) => {
                createIssueLink(dragNode.value, dropNode.value).then(result => {
                    if (result === 201)
                        setTreeData(createUpdateDataFunction(treeData))
                })
            }
            }
        />);
};

export default App;
