'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { getFirestore, collection, query, getDocs, doc, setDoc, getDoc, deleteDoc } from "@firebase/firestore"; // Correct Firestore imports
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions, AppBar, Toolbar } from "@mui/material";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const db = getFirestore();
    const snapshot = query(collection(db, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
    console.log(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredInventory(inventory);
    } else {
      setFilteredInventory(inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase())));
    }
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false); // Corrected function to update state

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} bgcolor="#f5f5f5" minHeight="100vh">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Inventory Management</Typography>
        </Toolbar>
      </AppBar>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 4 }}>
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ mt: 2, width: '80%' }}
      />
      <Modal open={open} onClose={handleClose}>
        <Box position="absolute"
          top="50%"
          left="50%"
          width={500}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose(); // Ensure handleClose is called
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="80%" mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              Inventory Items
            </Typography>
            {filteredInventory.length === 0 && (
              <Typography variant="body2" color="textSecondary">
                No items in inventory
              </Typography>
            )}
            {filteredInventory.map((item) => (
              <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#e3f2fd" mb={2} borderRadius={2}>
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">{item.quantity}</Typography>
                <Button variant="contained" color="secondary" onClick={() => removeItem(item.name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
