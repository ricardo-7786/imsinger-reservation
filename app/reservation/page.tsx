'use client';
export const dynamic = 'force-dynamic';

import {
  Box,
  Button,
  Input,
  Select,
  VStack,
  useToast,
  Text,
  Fade,
} from '@chakra-ui/react';
import { Suspense, useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { useSearchParams } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

const hourlyTimes = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

function ReservationContentInner() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const [user] = useAuthState(auth);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [teacher, setTeacher] = useState('');
  const [tagline, setTagline] = useState('');
  const [success, setSuccess] = useState(false);

  // 💡 Netlify iframe 안쪽 배경을 투명하게
  useEffect(() => {
    document.body.style.background = 'transparent';
    document.documentElement.style.background = 'transparent';
  }, []);

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
    const teacherFromURL = searchParams.get('teacher');
    const taglineFromURL = searchParams.get('tagline');

    if (teacherFromURL) {
      setTeacher(decodeURIComponent(teacherFromURL));
    }
    if (taglineFromURL) {
      setTagline(decodeURIComponent(taglineFromURL));
    }
  }, [user, searchParams]);

  const handleReservation = async () => {
    if (!name || !date || !time || !teacher) {
      toast({
        title: '모든 항목을 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(db, 'reservations'), {
        name,
        date,
        time,
        teacher,
        createdAt: new Date(),
        uid: user?.uid ?? null,
      });
      toast({
        title: '예약이 완료되었습니다!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setDate('');
      setTime('');
    } catch (err) {
      toast({
        title: '예약 실패',
        description: (err as Error).message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const taglineLines = tagline ? tagline.split('<br>') : [];

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(0,0,0,0.5)"
      zIndex={9999}
    >
      <Box
        p={8}
        bg="whiteAlpha.900"
        rounded="2xl"
        boxShadow="2xl"
        minW="360px"
        maxW="90vw"
        fontFamily="'Pretendard', sans-serif"
      >
        {(user?.displayName || taglineLines.length > 0) && (
          <Box textAlign="center" mb={10}>
            {user?.displayName && (
              <Text fontSize="md" fontWeight="bold" color="purple.600" mb={6}>
                {user.displayName}님, 환영합니다 👤
              </Text>
            )}
            {taglineLines.map((line, idx) => (
              <Text
                key={idx}
                fontSize="2xl"
                fontWeight="extrabold"
                color="gray.800"
                whiteSpace="pre-wrap"
              >
                '{line}'
              </Text>
            ))}
          </Box>
        )}

        <VStack spacing={4} align="stretch">
          <Input
            value={teacher ? `${teacher} 선생님의 보컬 레슨` : ''}
            isReadOnly
            focusBorderColor="purple.500"
            fontWeight="bold"
          />
          <Input
            type="date"
            placeholder="날짜"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            focusBorderColor="purple.500"
          />
          <Select
            placeholder="시간 선택 (00:00 ~ 23:00)"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            focusBorderColor="purple.500"
          >
            {hourlyTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>

          <Button
            leftIcon={<CheckCircleIcon />}
            bgGradient="linear(to-r, #7F53AC, #647DEE)"
            color="white"
            size="lg"
            px={8}
            py={6}
            fontWeight="bold"
            rounded="full"
            boxShadow="xl"
            _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
            transition="all 0.2s ease-in-out"
            onClick={handleReservation}
          >
            예약하기
          </Button>

          <Fade in={success}>
            <Text textAlign="center" fontWeight="medium" color="purple.600">
              🎉 예약이 성공적으로 완료되었습니다!
            </Text>
          </Fade>
        </VStack>
      </Box>
    </Box>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ReservationContentInner />
    </Suspense>
  );
}

