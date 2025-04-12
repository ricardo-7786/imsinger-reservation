'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Spinner,
  HStack,
  Divider,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import {
  CalendarIcon,
  TimeIcon,
  EditIcon,
  DeleteIcon,
  BellIcon,
} from '@chakra-ui/icons';
import { FiCreditCard, FiUser } from 'react-icons/fi';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  DocumentData,
  updateDoc,
} from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const [reservations, setReservations] = useState<DocumentData[]>([]);
  const [notifications, setNotifications] = useState<DocumentData[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<DocumentData | null>(null);
  const [payments, setPayments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const resQuery = query(collection(db, 'reservations'), where('userId', '==', user.uid));
    const notiQuery = query(collection(db, 'notifications'), where('recipientId', '==', user.uid));
    const appQuery = query(collection(db, 'teacher-requests'), where('email', '==', user.email));
    const payQuery = query(collection(db, 'payments'), where('userId', '==', user.uid));

    const [resSnap, notiSnap, appSnap, paySnap] = await Promise.all([
      getDocs(resQuery),
      getDocs(notiQuery),
      getDocs(appQuery),
      getDocs(payQuery),
    ]);

    setReservations(resSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setNotifications(notiSnap.docs.map(doc => doc.data()));
    setApplicationStatus(appSnap.docs[0]?.data() || null);
    setPayments(paySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    if (!loadingAuth && !user) {
      router.push('/auth');
    } else if (user) {
      fetchData();
    }
  }, [user, loadingAuth]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 예약을 삭제하시겠습니까?')) return;
    await deleteDoc(doc(db, 'reservations', id));
    fetchData();
  };

  const handleRefundRequest = async (paymentId: string) => {
    await updateDoc(doc(db, 'payments', paymentId), {
      refundRequested: true,
    });
    fetchData();
  };

  const cardBg = useColorModeValue('white', 'gray.800');

  if (loadingAuth || loading) {
    return (
      <Container maxW="lg" py={10}>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container maxW="lg" py={10} fontFamily="'Pretendard', sans-serif">
      <Box p={8} bg={cardBg} rounded="2xl" boxShadow="2xl">
        <Heading size="lg" mb={4} bgGradient="linear(to-r, #7F53AC, #647DEE)" bgClip="text">
          마이페이지
        </Heading>

        <Text fontSize="lg" fontWeight="bold">
          {user?.displayName || '사용자'} 님 환영합니다!
        </Text>
        <Text mb={4} color="gray.600">
          이메일: {user?.email}
        </Text>

        <Divider my={6} />

        <Heading size="md" mb={3}><Icon as={CalendarIcon} mr={2} />나의 예약 내역</Heading>
        {reservations.length === 0 ? (
          <Text>예약 내역이 없습니다.</Text>
        ) : (
          <VStack align="start" spacing={3} mb={6} w="full">
            {reservations.map((res, i) => (
              <Box key={i} p={4} bg="gray.50" borderRadius="xl" boxShadow="md" w="full">
                <Text><Icon as={CalendarIcon} mr={2} />날짜: {res.date}</Text>
                <Text><Icon as={TimeIcon} mr={2} />시간: {res.time}</Text>
                <Text><Icon as={FiUser} mr={2} />강사: {res.teacherName || '정보 없음'}</Text>
                <HStack spacing={3} mt={3}>
                  <Link href={`/edit-reservation?id=${res.id}`}>
                    <Button
                      size="sm"
                      leftIcon={<EditIcon />}
                      rounded="full"
                      bgGradient="linear(to-r, #7F53AC, #647DEE)"
                      color="white"
                      _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
                    >
                      수정
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    variant="outline"
                    colorScheme="red"
                    rounded="full"
                    fontWeight="medium"
                    _hover={{ bg: 'red.50', borderColor: 'red.300' }}
                    onClick={() => handleDelete(res.id)}
                  >
                    삭제
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        <Divider my={6} />

        <Heading size="md" mb={3}><Icon as={BellIcon} mr={2} />나의 알림</Heading>
        {notifications.length === 0 ? (
          <Text>알림이 없습니다.</Text>
        ) : (
          <VStack align="start" spacing={2} mb={6}>
            {notifications.map((note, i) => (
              <Box key={i} p={4} bg="gray.50" borderRadius="xl" boxShadow="md" w="full">
                <Text fontWeight="bold">{note.title || '알림'}</Text>
                <Text>{note.message}</Text>
              </Box>
            ))}
          </VStack>
        )}

        <Divider my={6} />

        <Heading size="md" mb={3}><Icon as={FiUser} mr={2} />강사 신청 현황</Heading>
        {applicationStatus ? (
          <Box p={3} border="1px solid #ddd" rounded="md">
            <Text>이름: {applicationStatus.name}</Text>
            <Text>상태: 신청 완료</Text>
          </Box>
        ) : (
          <Text>강사 신청 기록이 없습니다.</Text>
        )}

        <Divider my={6} />

        <Heading size="md" mb={3}><Icon as={FiCreditCard} mr={2} />결제 내역</Heading>
        {payments.length === 0 ? (
          <Text color="gray.500">결제 내역이 없습니다.</Text>
        ) : (
          <VStack align="start" spacing={3} mb={6} w="full">
            {payments.map((pay, i) => (
              <Box key={i} p={4} bg="gray.50" borderRadius="xl" boxShadow="md" w="full">
                <Text><b>상품명:</b> {pay.productName}</Text>
                <Text><b>금액:</b> {pay.amount?.toLocaleString()}원</Text>
                <Text><b>결제수단:</b> {pay.method}</Text>
                <Text><b>결제일:</b> {new Date(pay.timestamp?.toDate?.()).toLocaleString()}</Text>
                <HStack spacing={2} mt={2}>
                  <Button size="sm" colorScheme="purple" variant="outline" rounded="full">
                    결제 상세
                  </Button>
                  <Button size="sm" colorScheme="gray" variant="outline" rounded="full">
                    영수증 다운로드
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    rounded="full"
                    onClick={() => handleRefundRequest(pay.id)}
                    isDisabled={pay.refundRequested}
                  >
                    {pay.refundRequested ? '환불 요청됨' : '환불 요청'}
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        <Divider my={6} />

        <HStack justifyContent="space-between">
          <Link href="/auth">
            <Button
              bgGradient="linear(to-r, #7F53AC, #647DEE)"
              color="white"
              rounded="full"
              fontWeight="semibold"
              _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
              transition="all 0.2s ease-in-out"
            >
              회원정보 수정
            </Button>
          </Link>
          <Link href="/logout">
            <Button variant="ghost" colorScheme="red" rounded="full">
              로그아웃
            </Button>
          </Link>
        </HStack>
      </Box>
    </Container>
  );
}
