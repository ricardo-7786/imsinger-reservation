'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
  Icon,
  Container,
  Fade,
} from '@chakra-ui/react';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { CalendarDays, Clock, UserCircle, Trash2, Pencil } from 'lucide-react';

export default function MyReservationsPage() {
  const [user] = useAuthState(auth);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchReservations = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'reservations'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReservations(data);
    } catch (err) {
      toast({
        title: '데이터 불러오기 실패',
        description: '예약 정보를 가져오는 중 오류가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('이 예약을 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'reservations', id));
      toast({
        title: '삭제 완료',
        description: '예약이 성공적으로 삭제되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchReservations();
    } catch (err) {
      toast({
        title: '삭제 실패',
        description: '예약을 삭제하는 중 문제가 발생했습니다.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (user) fetchReservations();
  }, [user]);

  if (!user)
    return (
      <Container centerContent py={24}>
        <Text fontWeight="medium">로그인이 필요합니다.</Text>
      </Container>
    );

  if (loading)
    return (
      <Container centerContent py={24}>
        <Spinner size="xl" color="purple.400" />
        <Text mt={4}>로딩 중...</Text>
      </Container>
    );

  return (
    <Container maxW="lg" py={10}>
      <Heading
        size="lg"
        mb={8}
        textAlign="center"
        bgGradient="linear(to-r, purple.500, purple.800)"
        bgClip="text"
        fontWeight="extrabold"
      >
        내 예약 목록
      </Heading>
      {reservations.length === 0 ? (
        <Text textAlign="center" color="gray.500">예약 내역이 없습니다.</Text>
      ) : (
        <VStack spacing={6} align="stretch">
          {reservations.map((res) => (
            <Box
              key={res.id}
              p={6}
              bg="gray.50"
              borderRadius="2xl"
              boxShadow="lg"
              border="1px solid"
              borderColor="gray.100"
            >
              <Stack spacing={2} mb={4}>
                <Text>
                  <Icon as={CalendarDays} boxSize={5} mr={2} /> <strong>날짜:</strong> {res.date}
                </Text>
                <Text>
                  <Icon as={UserCircle} boxSize={5} mr={2} /> <strong>강사:</strong> {res.teacher}
                </Text>
                <Text>
                  <Icon as={Clock} boxSize={5} mr={2} /> <strong>시간:</strong> {res.time}
                </Text>
              </Stack>
              <Stack direction="row" spacing={3}>
                <Button
                  leftIcon={<Trash2 size={16} />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  rounded="full"
                  fontWeight="medium"
                  onClick={() => handleDelete(res.id)}
                >
                  삭제
                </Button>
                <Link href={`/edit-reservation?id=${res.id}`} passHref>
                  <Button
                    as="a"
                    leftIcon={<Pencil size={16} />}
                    bg="purple.600"
                    color="white"
                    _hover={{ bg: 'purple.700', transform: 'scale(1.05)' }}
                    transition="all 0.2s ease-in-out"
                    size="sm"
                    rounded="full"
                  >
                    수정하기
                  </Button>
                </Link>
              </Stack>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
} 




