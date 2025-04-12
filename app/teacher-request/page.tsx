'use client';

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function TeacherRequestPage() {
  const toast = useToast();
  const [form, setForm] = useState({
    name: '',
    email: '',
    genre: '',
    education: '',
    career: '',
    bio: '',
    profileImage: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, genre, education, career, bio } = form;
    if (!name || !email || !genre || !education || !career || !bio) {
      toast({
        title: '모든 항목을 입력해주세요.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addDoc(collection(db, 'teacher-requests'), {
        ...form,
        createdAt: new Date(),
      });
      toast({
        title: '신청이 완료되었습니다!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSuccessMessage(' 신청이 완료되었습니다!');
      setForm({
        name: '', email: '', genre: '', education: '',
        career: '', bio: '', profileImage: '',
      });
    } catch (error) {
      toast({
        title: '오류 발생',
        description: (error as Error).message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={10} fontFamily="'Pretendard', sans-serif">
      <Box p={8} bg="white" rounded="2xl" boxShadow="2xl">
        <Heading
          size="lg"
          mb={6}
          textAlign="center"
          bgGradient="linear(to-r, #7F53AC, #647DEE)"
          bgClip="text"
          fontWeight="extrabold"
        >
          강사 신청 폼
        </Heading>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>이름</FormLabel>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="홍길동" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>전문 분야</FormLabel>
              <Input name="genre" value={form.genre} onChange={handleChange} placeholder="보컬, 피아노 등" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>학력/이력</FormLabel>
              <Input name="education" value={form.education} onChange={handleChange} placeholder="○○대학교 졸업" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>경력</FormLabel>
              <Input name="career" value={form.career} onChange={handleChange} placeholder="○○학원 5년 강의" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>자기소개</FormLabel>
              <Textarea name="bio" value={form.bio} onChange={handleChange} placeholder="간단한 소개를 작성해주세요." rows={4} />
            </FormControl>

            <FormControl>
              <FormLabel>프로필 사진 URL</FormLabel>
              <Input name="profileImage" value={form.profileImage} onChange={handleChange} placeholder="이미지 주소를 입력해주세요" />
            </FormControl>

            <Button
              type="submit"
              leftIcon={<CheckCircleIcon />}
              bgGradient="linear(to-r, #7F53AC, #647DEE)"
              color="white"
              size="lg"
              fontWeight="semibold"
              rounded="full"
              boxShadow="xl"
              _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
              transition="all 0.2s ease-in-out"
            >
              신청하기
            </Button>
          </Stack>
        </form>

        {successMessage && (
          <Text
            textAlign="center"
            mt={6}
            color="purple.600"
            fontWeight="semibold"
          >
            {successMessage}
          </Text>
        )}
      </Box>
    </Container>
  );
}

















