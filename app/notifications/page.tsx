'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { BellIcon } from '@chakra-ui/icons';

export default function NotificationsPage() {
  const [user] = useAuthState(auth);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setNotifications(data);
    };

    fetchNotifications();
  }, [user]);

  return (
    <Container maxW="lg" py={10}>
      <Box p={8} bg="white" borderRadius="2xl" boxShadow="2xl">
        <HStack justifyContent="center" mb={6}>
          <Icon as={BellIcon} boxSize={6} color="purple.500" />
          <Heading
            size="lg"
            bgGradient="linear(to-r, #7F53AC, #647DEE)"
            bgClip="text"
            fontWeight="extrabold"
          >
            내 알림
          </Heading>
        </HStack>

        {notifications.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            알림이 없습니다.
          </Text>
        ) : (
          <VStack spacing={5} align="stretch">
            {notifications.map((note, idx) => (
              <Box
                key={idx}
                p={4}
                bg="gray.50"
                borderRadius="lg"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="bold" mb={1}>{note.title}</Text>
                <Text fontSize="sm" color="gray.700">{note.message}</Text>
                <Divider my={2} />
                <Text fontSize="xs" color="gray.500">
                  {new Date(note.timestamp?.toDate?.() ?? Date.now()).toLocaleString()}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Container>
  );
}