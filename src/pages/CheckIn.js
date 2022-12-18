import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import QrReader from 'react-qr-scanner';

function CheckIn({connectedContract}) {
  const toast = useToast();
  const [showScanner, setShowScanner] = useState(false);

  const [scannedAddress, setScannedAddress] = useState(null);

  const [hasTicket, setHasTicket] = useState(false);

  const [checkInTxnPending, setCheckInTxnPending] = useState(false);

  const checkIn = async() => {
    try {
      if(!connectedContract) return;

      setCheckInTxnPending(true);
      const checkInTxn = await connectedContract.checkIn(scannedAddress);
      await checkInTxn.wait();
      setCheckInTxnPending(false);

      toast({
        status: 'success',
        title: 'Success!',
        variant: 'subtle',
        description:(
          <a href={`https://goerli.etherscan.io/tx/${checkInTxn.hash}`}
             target="_blank"
             rel="nofollow noreferrer">
                Checkout the transaction on Etherscan
             </a>
        )
      });

    } catch (error) {
      setCheckInTxnPending(false);
      toast({
        status: 'error',
        title: 'Failure',
        variant: 'subtle',
        description: error.message
      });
      console.log(error);
      
    }
  }

  useEffect(() => {
    const confirmOwnership = async () =>{
      try {
        if(!connectedContract) return;
        const res = await connectedContract.confirmOwnership(scannedAddress);
        setHasTicket(res);
        console.log(res);
      } catch (error) {
        console.log(error)
      }
    };

    if(scannedAddress){
      confirmOwnership();
    }
  },[connectedContract, scannedAddress])
  return (
    <>
      <Heading mb={4}>Check In</Heading>
      {!showScanner && scannedAddress && hasTicket && (
        <>
          <Text fontSize="xl" mb={8}>
            This wallet owns a NFTix!
          </Text>
          <Flex width="100%" justifyContent="center">
            <Button 
              onClick={checkIn}
              isLoading={checkInTxnPending}
              size="lg" 
              colorScheme="teal">Check In</Button>
          </Flex>
        </>
        
      )}
      {!showScanner && (
        <>
        {!scannedAddress && (
          <Text fontSize="xl" mb={8}>
          Scan wallet address to verify
          ticket ownership and check-in.
        </Text>
        )}
        {scannedAddress && !hasTicket && (
          <Text fontSize="xl" mb={8}>
            This wallet does not own a NFTix
          </Text>
        )}

        {!hasTicket && (
          <Flex width="100%" justifyContent="center">
            <Button 
              onClick={() => setShowScanner(true)}
              size="lg" 
              colorScheme="teal"
            >
              Scan Qr
            </Button>
          </Flex>
        )}
        </>
      )}
      
      {showScanner && (
        <>
        <Box
          margin="16px auto 8px auto"
          padding="0 16px"
          width="360px"
        >
          <QrReader 
            delay={3000}
            style={
              {
                maxWidth: "100%",
                margin:"0 auto"
              }
            }
            onError={(error) =>{
              console.log(error);
              toast({
                status: 'error',
                title: 'Failure',
                variant: 'subtle',
                description: error.message
              });
              setShowScanner(false);
            }}
            onScan={(data) => {
              if(!data) return;
              const address = data.text.split("ethereum:");
              console.log("scanned address", address[1].slice(0,42));
              setScannedAddress(address[1].slice(0,42));
              setShowScanner(false);

              toast({
                title:"Captured address!",
                description: `${address[1].slice(0,6)}
                ...${address[1].slice(-4)}`,
                status:"success",
                variant:"subtle"
              })
            }}

          />
        </Box>
        <Flex
        width="100%"
        justifyContent="center"
      >
        <Button
          onClick={() => setShowScanner(false)}
          size="lg"
          colorScheme="red"
        >
          Cancel
        </Button>
      </Flex>
      </>
      )}
    </>
  );
}

export default CheckIn;
