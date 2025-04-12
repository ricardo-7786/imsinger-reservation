'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Text,
  useToast,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ALL_HOURS = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, '0')}:00`
);

export default function AvailableTimePage() {
  const [teacherName, setTeacherName] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleTime = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time)
        ? prev.filter((t) => t !== time)
        : [...prev, time].sort()
    );
  };

  const resetTimes = () => setSelectedTimes([]);

  const saveTimes = async () => {
    if (!teacherName) {
      setMessage('강사 이름을 입력해주세요.');
      setSuccess(false);
      return;
    }

    try {
      await setDoc(doc(db, 'teachers', teacherName), {
        availableTimes: selectedTimes.sort(),
      });
      setMessage('저장되었습니다!');
      setSuccess(true);
    } catch (err: any) {
      setMessage(`저장 실패: ${err.message}`);
      setSuccess(false);
    }
  };

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Container maxW="lg" py={10}>
      <Box
        p={8}
        borderRadius="2xl"
        boxShadow="xl"
        bg={cardBg}
        border="1px solid"
        borderColor="gray.100"
      >
        <Heading
          mb={6}
          textAlign="center"
          fontSize="2xl"
          fontWeight="extrabold"
          bgGradient="linear(to-r, #7F53AC, #647DEE)"
          bgClip="text"
        >
          레슨 가능 시간 등록
        </Heading>

        <VStack spacing={5}>
          <Input
            placeholder="강사 이름을 입력하세요 (예: 김보컬)"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            rounded="xl"
            size="lg"
            bg="gray.50"
          />

          <Box w="full">
            <Text fontWeight="bold" mb={2}>오전</Text>
            <SimpleGrid columns={[3, 4]} spacing={3}>
              {ALL_HOURS.filter(h => Number(h.split(':')[0]) < 12).map((time) => (
                <Button
                  key={time}
                  variant={selectedTimes.includes(time) ? 'solid' : 'outline'}
                  colorScheme={selectedTimes.includes(time) ? 'purple' : 'gray'}
                  onClick={() => toggleTime(time)}
                >
                  {time}
                </Button>
              ))}
            </SimpleGrid>
          </Box>

          <Box w="full">
            <Text fontWeight="bold" mt={6} mb={2}>오후</Text>
            <SimpleGrid columns={[3, 4]} spacing={3}>
              {ALL_HOURS.filter(h => Number(h.split(':')[0]) >= 12).map((time) => (
                <Button
                  key={time}
                  variant={selectedTimes.includes(time) ? 'solid' : 'outline'}
                  colorScheme={selectedTimes.includes(time) ? 'purple' : 'gray'}
                  onClick={() => toggleTime(time)}
                >
                  {time}
                </Button>
              ))}
            </SimpleGrid>
          </Box>

          <HStack spacing={4} mt={6}>
            <Button
              colorScheme="purple"
              px={6}
              rounded="full"
              onClick={saveTimes}
              fontWeight="semibold"
            >
              저장하기
            </Button>
            <IconButton
              aria-label="초기화"
              icon={<RepeatIcon />}
              variant="outline"
              onClick={resetTimes}
            />
          </HStack>

          {message && (
                    <HStack mt={4} spacing={-1.0} align="center">
                      {success && (
                        <Image
                          src="/icons/check.png"
                          alt="check icon"
                          boxSize="34px"
                          objectFit="contain" // 비율 유지
                          borderRadius="md"   // 부드러운 모서리 (선택)
                        />
                      )}
                      <Text color={success ? 'purple.600' : 'red.500'} fontWeight="medium">
                        {message}
                      </Text>
                    </HStack>
                  )}
        </VStack>
      </Box>
    </Container>
  );
}


