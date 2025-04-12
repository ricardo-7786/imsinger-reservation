'use client';

import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  Text,
  Avatar,
  Heading,
  Fade,
} from '@chakra-ui/react';
import { LockIcon, CheckCircleIcon } from '@chakra-ui/icons';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo(data);
          setName(data.displayName || '');
        } else {
          const fallbackName = user.displayName || '';
          setUserInfo({ email: user.email, displayName: fallbackName });
          setName(fallbackName);
        }
      } else {
        setLoggedIn(false);
        setUserInfo(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: name,
          createdAt: new Date(),
        });
        setMessage('회원가입 성공!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('로그인 성공!');
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('로그아웃 성공!');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleNameChange = async () => {
    if (!auth.currentUser || !newName) return;
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: newName,
      });
      setName(newName);
      setUserInfo({ ...userInfo, displayName: newName });
      setMessage('이름 변경 완료!');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleEmailChange = async () => {
    if (!auth.currentUser || !newEmail) return;
    try {
      await updateEmail(auth.currentUser, newEmail);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        email: newEmail,
      });
      setUserInfo({ ...userInfo, email: newEmail });
      setMessage('이메일 변경 완료!');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser || !newPassword) return;
    try {
      await updatePassword(auth.currentUser, newPassword);
      setMessage('비밀번호 변경 완료!');
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <Text align="center">로딩 중...</Text>;

  return (
    <Container maxW="md" py={10} fontFamily="'Pretendard', sans-serif">
      <Box p={8} bg="white" borderRadius="2xl" boxShadow="2xl">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar bg="purple.500" icon={<LockIcon />} />
          <Heading
            size="lg"
            mt={4}
            mb={6}
            bgGradient="linear(to-r, #7F53AC, #647DEE)"
            bgClip="text"
            fontWeight="extrabold"
          >
            {loggedIn ? '환영합니다!' : mode === 'signup' ? '회원가입' : '로그인'}
          </Heading>

          {!loggedIn ? (
            <Box as="form" onSubmit={handleSubmit} w="100%">
              <Stack spacing={4}>
                {mode === 'signup' && (
                  <Input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
                )}
                <Input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button
                  type="submit"
                  leftIcon={<CheckCircleIcon />}
                  bgGradient="linear(to-r, #7F53AC, #647DEE)"
                  color="white"
                  size="lg"
                  fontWeight="semibold"
                  rounded="full"
                  boxShadow="lg"
                  _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
                  transition="all 0.2s ease-in-out"
                >
                  {mode === 'signup' ? '회원가입' : '로그인'}
                </Button>
                <Button variant="link" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
                  {mode === 'signup' ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
                </Button>
              </Stack>
            </Box>
          ) : (
            <Stack spacing={4} w="100%">
              <Text fontWeight="medium">{userInfo?.displayName || userInfo?.email} 님</Text>

              <Button
                variant="outline"
                borderColor="red.400"
                color="red.500"
                rounded="full"
                _hover={{ bg: 'red.50' }}
                onClick={handleLogout}
              >
                로그아웃
              </Button>

              <Input placeholder="새 이름" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Button
                onClick={handleNameChange}
                bgGradient="linear(to-r, #7F53AC, #647DEE)"
                color="white"
                rounded="full"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
              >
                이름 변경
              </Button>

              <Input placeholder="새 이메일" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <Button
                onClick={handleEmailChange}
                bgGradient="linear(to-r, #7F53AC, #647DEE)"
                color="white"
                rounded="full"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
              >
                이메일 변경
              </Button>

              <Input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Button
                onClick={handlePasswordChange}
                bgGradient="linear(to-r, #7F53AC, #647DEE)"
                color="white"
                rounded="full"
                _hover={{ transform: 'scale(1.05)', boxShadow: 'xl' }}
              >
                비밀번호 변경
              </Button>
            </Stack>
          )}

          {message && (
            <Fade in={true}>
              <Text mt={5} color="purple.600" fontWeight="semibold">
                {message}
              </Text>
            </Fade>
          )}
        </Box>
      </Box>
    </Container>
  );
}




