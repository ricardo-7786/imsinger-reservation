"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Checkbox,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export default function ReviewTeachersPage() {
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showFullBioIds, setShowFullBioIds] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchPending = async () => {
    const q = query(
      collection(db, "pendingTeachers"),
      orderBy("createdAt", sortNewestFirst ? "desc" : "asc")
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPendingTeachers(list);
  };

  useEffect(() => {
    fetchPending();
  }, [sortNewestFirst]);

  const handleApprove = async (teacher: any) => {
    if (!confirm(`${teacher.name} 강사를 승인하시겠습니까?`)) return;
    try {
      await setDoc(doc(db, "teachers", teacher.name), {
        name: teacher.name,
        email: teacher.email,
        availableTimes: [],
      });
      await addDoc(collection(db, "notifications"), {
        to: "admin",
        message: `${teacher.name} 님이 강사로 등록되었습니다.`,
        createdAt: new Date(),
      });
      await deleteDoc(doc(db, "pendingTeachers", teacher.id));
      setMessage(`${teacher.name} 강사 등록 완료`);
      fetchPending();
    } catch (err: any) {
      setMessage(`오류: ${err.message}`);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm(`정말 거절하시겠습니까?`)) return;
    await deleteDoc(doc(db, "pendingTeachers", id));
    setMessage("거절 처리 완료");
    fetchPending();
  };

  const filteredList = pendingTeachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBio = (id: string) => {
    setShowFullBioIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const formatBioWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#805AD5" }}
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Container maxW="xl" py={10} fontFamily="'Pretendard', sans-serif">
      <Heading size="lg" mb={6} bgGradient="linear(to-r, purple.500, purple.800)" bgClip="text">
        🔒 관리자 전용: 강사 등록 요청 검토
      </Heading>

      <Input
        placeholder="이름으로 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={4}
        focusBorderColor="purple.500"
        bg="white"
        rounded="lg"
      />

      <Checkbox
        isChecked={sortNewestFirst}
        onChange={(e) => setSortNewestFirst(e.target.checked)}
        mb={6}
        colorScheme="purple"
      >
        최신순 정렬
      </Checkbox>

      <VStack spacing={5} align="stretch">
        {filteredList.length === 0 ? (
          <Text color="gray.500">등록 요청이 없습니다.</Text>
        ) : (
          filteredList.map((teacher) => {
            const showFull = showFullBioIds.includes(teacher.id);
            return (
              <Box
                key={teacher.id}
                bg="gray.50"
                borderWidth={1}
                borderRadius="xl"
                p={6}
                boxShadow="sm"
              >
                <Text fontWeight="semibold" color="gray.700">
                  이름: <Text as="span" color="purple.600" cursor="pointer" onClick={() => { setSelectedTeacher(teacher); onOpen(); }}>{teacher.name}</Text>
                </Text>
                <Text color="gray.600">이메일: {teacher.email}</Text>
                <Text color="gray.600">
                  소개: {teacher.bio ? (
                    showFull ? (
                      <>
                        {formatBioWithLinks(teacher.bio)} <Button variant="link" size="sm" colorScheme="purple" onClick={() => toggleBio(teacher.id)}>간략히</Button>
                      </>
                    ) : (
                      <>
                        {teacher.bio.slice(0, 100)}... <Button variant="link" size="sm" colorScheme="purple" onClick={() => toggleBio(teacher.id)}>더보기</Button>
                      </>
                    )
                  ) : ("-")}
                </Text>
                <Stack direction="row" spacing={3} mt={4}>
                  <Button colorScheme="purple" onClick={() => handleApprove(teacher)} rounded="full">승인</Button>
                  <Button variant="outline" colorScheme="red" onClick={() => handleReject(teacher.id)} rounded="full">거절</Button>
                </Stack>
              </Box>
            );
          })
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>강사 상세 정보</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTeacher && (
              <Stack spacing={3} py={4}>
                <Text><strong>이름:</strong> {selectedTeacher.name}</Text>
                <Text><strong>이메일:</strong> {selectedTeacher.email}</Text>
                <Text><strong>소개:</strong> {formatBioWithLinks(selectedTeacher.bio || "-")}</Text>
                <Text><strong>신청일:</strong> {selectedTeacher.createdAt?.toDate?.().toLocaleString?.() || "-"}</Text>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {message && <Text mt={6} color="green.500" fontWeight="medium">{message}</Text>}
    </Container>
  );
}
