'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
  Icon,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { db } from '@/lib/firebase';
import { UserCheck, Trash2 } from 'lucide-react';

interface TeacherRequest {
  id: string;
  name: string;
  email: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<TeacherRequest[]>([]);
  const [message, setMessage] = useState('');
  const toast = useToast();

  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, 'teacherRequests'));
    const list = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as TeacherRequest)
    );
    setRequests(list);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveTeacher = async (teacher: TeacherRequest) => {
    try {
      await setDoc(doc(db, 'teachers', teacher.name), {
        email: teacher.email,
        availableTimes: [],
      });
      await deleteDoc(doc(db, 'teacherRequests', teacher.id));
      await setDoc(doc(db, 'notifications', `${teacher.id}_approved`), {
        to: teacher.email,
        message: `${teacher.name} 강사님의 등록이 승인되었습니다.`,
        createdAt: new Date(),
      });
      toast({ title: '승인 완료', status: 'success', duration: 3000 });
      fetchRequests();
    } catch (err: any) {
      toast({ title: '오류 발생', description: err.message, status: 'error' });
    }
  };

  const deleteRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'teacherRequests', id));
      toast({ title: '삭제 완료', status: 'info', duration: 3000 });
      fetchRequests();
    } catch (err: any) {
      toast({ title: '삭제 실패', description: err.message, status: 'error' });
    }
  };

  return (
    <Container maxW="lg" py={10}>
      <Heading
        size="lg"
        mb={6}
        textAlign="center"
        bgGradient="linear(to-r, purple.500, purple.300)"
        bgClip="text"
        fontWeight="extrabold"
      >
        관리자 대시보드
      </Heading>

      {requests.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          대기 중인 강사 요청이 없습니다.
        </Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {requests.map((r) => (
            <Box
              key={r.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="gray.50"
              boxShadow="sm"
            >
              <Text fontWeight="bold" mb={1}>{r.name}</Text>
              <Text fontSize="sm" color="gray.600">{r.email}</Text>
              <Divider my={3} />
              <Stack direction="row" spacing={3} justify="flex-end">
                <Button
                  leftIcon={<Icon as={UserCheck} />}
                  colorScheme="purple"
                  variant="solid"
                  onClick={() => approveTeacher(r)}
                >
                  승인
                </Button>
                <Button
                  leftIcon={<Icon as={Trash2} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => deleteRequest(r.id)}
                >
                  삭제
                </Button>
              </Stack>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
}