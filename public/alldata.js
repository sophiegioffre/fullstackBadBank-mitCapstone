function AllData(){
    const [data, setData] = React.useState([]);    

    React.useEffect(() => {
        
        // fetch all accounts from API
        fetch('/account/all')
            .then(response => response.json())
            .then(data => {
                console.log(`all data: ${JSON.stringify(data)}`);
                console.log(`data 0: ${JSON.stringify(data[0])}`);
                console.log(`data 0 balance: ${JSON.stringify(data[0]["balance"])}`);
                setData(JSON.stringify(data));
            });

    }, []);

    return (<>
        <h5>All Data in Store:</h5>
        {data}
    </>);
}
