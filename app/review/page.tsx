'use client';
export const dynamic = 'force-dynamic';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  useToast,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { StarIcon } from '@chakra-ui/icons';

export default function ReviewPage() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const reservationId = params.get('id');

  const [teacherName, setTeacherName] = useState('');
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');

  // reservationId 확인 후 로딩 방지
  useEffect(() => {
    if (!reservationId) return;

    const fetchReservation = async () => {
      try {
        const resDoc = await getDoc(doc(db, 'reservations', reservationId));
        if (resDoc.exists()) {
          setTeacherName(resDoc.data().teacherName || '강사 정보 없음');
        } else {
          toast({ title: '예약 정보를 찾을 수 없습니다.', status: 'error' });
          router.push('/mypage');
        }
      } catch (error) {
        console.error('예약 정보 로드 실패:', error);
        toast({ title: '오류가 발생했습니다.', status: 'error' });
        router.push('/mypage');
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId]);

  useEffect(() => {
    if (reservationId === null) {
      toast({ title: '잘못된 접근입니다.', status: 'error' });
      router.push('/mypage');
    }
  }, [reservationId]);

  const handleSubmit = async () => {
    if (!rating || !content.trim()) {
      toast({ title: '별점과 내용을 모두 입력해주세요.', status: 'warning' });
      return;
    }

    try {
      await setDoc(doc(db, 'reviews', reservationId!), {
        reservationId,
        teacherName,
        rating,
        content: content.trim(),
        createdAt: serverTimestamp(),
      });
      toast({ title: '리뷰가 등록되었습니다.', status: 'success' });
      router.push('/mypage');
    } catch (error) {
      toast({ title: '리뷰 저장 중 오류 발생', status: 'error' });
      console.error('리뷰 저장 오류:', error);
    }
  };

  if (loading) {
    return (
      <Container maxW="md" py={10}>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container maxW="md" py={10} fontFamily="'Pretendard', sans-serif">
      <Box p={6} bg={cardBg} rounded="2xl" boxShadow="xl">
        <Heading size="md" mb={4}>리뷰 작성</Heading>
        <Text mb={2}><b>강사명:</b> {teacherName}</Text>

        <Text mb={1}>별점</Text>
        <HStack mb={4}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              boxSize={6}
              cursor="pointer"
              color={star <= rating ? 'yellow.400' : 'gray.300'}
              onClick={() => setRating(star)}
            />
          ))}
        </HStack>

        <Text mb={1}>리뷰 내용</Text>
        <Textarea
          placeholder="어떤 점이 좋았나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          mb={4}
        />

        <Button
          colorScheme="purple"
          onClick={handleSubmit}
          rounded="full"
        >
          리뷰 제출하기
        </Button>
      </Box>
    </Container>
  );
}

