import {useState} from 'react';
import {
  Button,
  Flex,
  Heading,
  Text,
  useToast
} from "@chakra-ui/react";

function Admin({
  isOwner,
  connectedContract
}
) {
  const toast = useToast();
  const  [openSaleTxnPending, setOpenSaleTxnPending] = useState(false);
  const  [closeSaleTxnPending, setCloseSaleTxnPending] = useState(false);


  const closeSale = async ()=>{
    try{
      if(!connectedContract) return;

      setCloseSaleTxnPending(true);
      let closeSaleTxn = await connectedContract.closeSale();
      await closeSaleTxn.wait();
      setCloseSaleTxnPending(false);

      toast({
        status: 'success',
        title: 'Sale is closed!',
        variant: 'subtle',
        description:(
          <a href={`https://goerli.etherscan.io/tx/${closeSaleTxn.hash}`}
             target="_blank"
             rel="nofollow noreferrer">
                Checkout the transaction on Etherscan
             </a>
        )
      });
    }catch(err){
      console.log(err);
      setCloseSaleTxnPending(false);
      toast({
        status: 'error',
        title: 'Failure',
        variant: 'subtle',
        description: err
      });
    }
  }
  const openSale = async () =>{
    try{
      if(!connectedContract) return;

      setOpenSaleTxnPending(true);
      console.log("admin cc", connectedContract);
      let openSaleTxn = await connectedContract.openSale();
      await openSaleTxn.wait();
      setOpenSaleTxnPending(false);

      toast({
        status: 'success',
        title: 'Sale is open!',
        variant: 'subtle',
        description:(
          <a href={`https://goerli.etherscan.io/tx/${openSaleTxn.hash}`}
             target="_blank"
             rel="nofollow noreferrer">
                Checkout the transaction on Etherscan
             </a>
        )
      });
    }catch(err){
      console.log(err);
      setOpenSaleTxnPending(false);
      toast({
        status: 'error',
        title: 'Failure',
        variant: 'subtle',
        description: err
      });
    }
  }
  return (
    <>
      <Heading mb={4}>
        Admin panel
      </Heading>
      <Text fontSize="xl" mb={8}>
        Enable and disable sales on the
        smart contract.
      </Text>
      <Flex
        width="100%"
        justifyContent="center"
      >
        <Button
          isLoading={openSaleTxnPending}
          onClick={openSale}
          isDisabled={!isOwner || closeSaleTxnPending}
          size="lg"
          colorScheme="teal"
        >
          Open Sale
        </Button>
        <Button
          isDisabled={!isOwner || openSaleTxnPending}
          onClick={closeSale}
          isLoading={closeSaleTxnPending}
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
