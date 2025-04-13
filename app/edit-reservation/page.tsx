'use client';

export const dynamic = 'force-dynamic';

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Fade,
} from '@chakra-ui/react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CheckCircleIcon } from '@chakra-ui/icons';

function EditReservationInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const toast = useToast();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [teacher, setTeacher] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const docRef = doc(db, 'reservations', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name);
          setDate(data.date);
          setTime(data.time);
          setTeacher(data.teacher);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!id || !name || !date || !time || !teacher) {
      toast({
        title: '모든 항목을 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { name, date, time, teacher });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      toast({
        title: '예약 수정 완료! 🎉',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/my-reservations');
    } catch (err) {
      toast({
        title: '수정 실패',
        description: (err as Error).message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={10} fontFamily="'Pretendard', sans-serif">
      <Box p={8} bg="white" borderRadius="2xl" boxShadow="2xl">
        <Heading
          size="lg"
          mb={6}
          textAlign="center"
          bgGradient="linear(to-r, #7F53AC, #647DEE)"
          bgClip="text"
          fontWeight="extrabold"
        >
          예약 정보 수정
        </Heading>

        <VStack spacing={4} align="stretch">
          <Input
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            focusBorderColor="purple.500"
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            focusBorderColor="purple.500"
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            focusBorderColor="purple.500"
          />
          <Select
            placeholder="강사 선택"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            focusBorderColor="purple.500"
          >
            <option value="김보컬">김보컬</option>
            <option value="박보컬">박보컬</option>
          </Select>

          <Button
            leftIcon={<CheckCircleIcon />}
            bgGradient="linear(to-r, #7F53AC, #647DEE)"
            color="white"
            size="lg"
            fontWeight="semibold"
            rounded="full"
            boxShadow="lg"
            _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
            transition="all 0.2s ease-in-out"
            onClick={handleUpdate}
          >
            수정 완료
          </Button>

          <Fade in={success}>
            <Text textAlign="center" fontWeight="medium" color="purple.600">
              🎉 예약이 성공적으로 수정되었습니다!
            </Text>
          </Fade>
        </VStack>
      </Box>
    </Container>
  );
}

export default function EditReservationPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <EditReservationInner />
    </Suspense>
  );
}








