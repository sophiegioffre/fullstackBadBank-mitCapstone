function Home(){
  return (
    <Card
      txtcolor="black"
      header="Welcome to the Bank"
      title=""
      text="Create an account, login to an existing account, deposit and withdraw funds, and check your balance!"
      body={(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)}
    />
  );  
}
