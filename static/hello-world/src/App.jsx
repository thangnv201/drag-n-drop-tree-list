import React, {useState} from "react";
import {requestJira} from "@forge/bridge";
import {Tree} from "rsuite";

const styles = {
    padding: 20, textAlign: "center",
};

const data = async () => {
    const params = 'issueLinkType != "is blocked by" or issueLinkType = null';
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    console.log('call api jira');
    return await response.json();
};
const issueData = data().then((result) => {
    let data = [];

    result.issues.forEach((element) => {
        data.push({
            label: element.key, value: element.key, visible: true,
        });
    });

    return data;
});
const App = () => {
    let [treeData, setTreeData] = useState();

    issueData.then((data) => {
        if (treeData === undefined) {
            setTreeData(data);
        }
    });
    console.log('reload plugin');
    return (<div style={styles}>
        <Tree
            data={treeData}
            draggable
            defaultExpandAll
            onDrop={({createUpdateDataFunction}, event) => {
                setTreeData(createUpdateDataFunction(treeData))
            }
            }
        />
    </div>);
};

export default App;
