import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { MessageSquare, Users, Bell, Eye, Trash2, X, AlertCircle, LogOut, User } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #0f172a, #581c87, #0f172a);
`;

const CenteredContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const AuthCard = styled.div`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #334155;
  max-width: 28rem;
  width: 100%;
`;

const AuthTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const AuthSubtitle = styled.p`
  color: #d8b4fe;
  text-align: center;
`;

const AuthButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const AuthModeButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: ${props => props.active ? '#a855f7' : '#334155'};
  color: ${props => props.active ? 'white' : '#cbd5e1'};

  &:hover {
    opacity: 0.9;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  background: #334155;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  transition: all 0.2s;

  &:focus {
    ring: 2px solid #a855f7;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  background: #a855f7;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #9333ea;
  }
`;

const AuthFooter = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #94a3b8;
`;

const AuthLink = styled.button`
  color: #c084fc;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const InfoBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #cbd5e1;

  p {
    margin: 0.25rem 0;
  }

  p:first-of-type {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
`;

const MainContainer = styled.div`
  container: mx-auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`;

const MainSubtitle = styled.p`
  color: #d8b4fe;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const UserBadge = styled.div`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
`;

const Username = styled.span`
  color: white;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
  }
`;

const BoardTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const BoardTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  background: ${props => props.active ? props.bgColor : '#1e293b'};
  color: ${props => props.active ? 'white' : '#cbd5e1'};
  box-shadow: ${props => props.active ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'};
  transform: ${props => props.active ? 'scale(1.05)' : 'scale(1)'};

  &:hover {
    background: ${props => props.active ? props.bgColor : '#334155'};
  }
`;

const ContentContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #334155;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WriteButton = styled.button`
  background: ${props => props.bgColor};
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PostItem = styled.div`
  background: rgba(51, 65, 85, 0.5);
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #334155;

    h3 {
      color: #d8b4fe;
    }
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
`;

const PostTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
`;

const ImportantBadge = styled.span`
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const ViewCount = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #94a3b8;
  font-size: 0.875rem;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
`;

const PostAuthor = styled.span`
  color: #94a3b8;
`;

const PostDate = styled.span`
  color: #64748b;
`;

const DetailCard = styled(Card)`
  padding: 2rem;
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
`;

const DetailTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: white;
`;

const CloseButton = styled.button`
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const DetailMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
  border-bottom: 1px solid #334155;
  padding-bottom: 1rem;
`;

const DetailContent = styled.div`
  color: #e2e8f0;
  margin-bottom: 2rem;
  white-space: pre-wrap;
  line-height: 1.75;
  min-height: 200px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SecondaryButton = styled.button`
  background: #334155;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #475569;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #dc2626;
  }
`;

const FormCard = styled(Card)`
  padding: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  background: #334155;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
  min-height: 200px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    ring: 2px solid #a855f7;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background: ${props => props.bgColor};
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// Main Component
const BoardSystem = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });

  const [currentBoard, setCurrentBoard] = useState('anonymous');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    department: '',
    is_important: false
  });

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [currentBoard, isAuthenticated]);

  const checkSession = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/check`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  const handleAuth = async () => {
    if (!authForm.username || !authForm.password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    const endpoint = authMode === 'login' ? 'login' : 'register';

    try {
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(authForm)
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setUser(data.user);
        setAuthForm({ username: '', password: '' });
        alert(authMode === 'login' ? '로그인 성공!' : '회원가입 성공!');
      } else {
        alert(data.error || '인증 실패');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('인증에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setUser(null);
      setPosts([]);
      setSelectedPost(null);
      setShowWriteForm(false);
      alert('로그아웃되었습니다.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${currentBoard}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const viewPost = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${currentBoard}/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setSelectedPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('제목과 내용은 필수입니다.');
      return;
    }

    if (currentBoard === 'department' && !formData.author) {
      alert('작성자명을 입력해주세요.');
      return;
    }


    try {
      const response = await fetch(`${API_URL}/${currentBoard}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('게시글이 작성되었습니다.');
        setShowWriteForm(false);
        setFormData({
          title: '',
          content: '',
          author: '',
          department: '',
          is_important: false
        });
        fetchPosts();
      } else {
        const data = await response.json();
        if (data.needLogin) {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          setIsAuthenticated(false);
          setUser(null);
        } else {
          alert('게시글 작성에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${API_URL}/${currentBoard}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('게시글이 삭제되었습니다.');
        setSelectedPost(null);
        fetchPosts();
      } else {
        const data = await response.json();
        alert(data.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const boards = [
    { id: 'anonymous', name: '익명게시판', icon: MessageSquare, color: '#a855f7' },
    { id: 'department', name: '과 게시판', icon: Users, color: '#3b82f6' },
    { id: 'notice', name: '공지사항', icon: Bell, color: '#ef4444' }
  ];

  const currentBoardInfo = boards.find(b => b.id === currentBoard) || boards[0];

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <CenteredContainer>
          <AuthCard>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <AuthTitle>게시판</AuthTitle>
              <AuthSubtitle>로그인하여 게시판을 이용하세요</AuthSubtitle>
            </div>

            <AuthButtonGroup>
              <AuthModeButton
                active={authMode === 'login'}
                onClick={() => setAuthMode('login')}
              >
                로그인
              </AuthModeButton>
              <AuthModeButton
                active={authMode === 'register'}
                onClick={() => setAuthMode('register')}
              >
                회원가입
              </AuthModeButton>
            </AuthButtonGroup>

            <InputGroup>
              <Input
                type="text"
                placeholder="아이디"
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
              <PrimaryButton onClick={handleAuth}>
                {authMode === 'login' ? '로그인' : '회원가입'}
              </PrimaryButton>
            </InputGroup>

            <AuthFooter>
              {authMode === 'login' ? (
                <p>계정이 없으신가요? <AuthLink onClick={() => setAuthMode('register')}>회원가입</AuthLink></p>
              ) : (
                <p>이미 계정이 있으신가요? <AuthLink onClick={() => setAuthMode('login')}>로그인</AuthLink></p>
              )}
            </AuthFooter>

            <InfoBox>
              <p>ℹ️ 세션 정보</p>
              <p>• 로그인 후 1시간 동안 세션 유지</p>
              <p>• 글 작성/삭제는 본인만 가능</p>
            </InfoBox>
          </AuthCard>
        </CenteredContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <MainContainer>
        <Header>
          <MainTitle>게시판</MainTitle>
          <MainSubtitle>세 가지 게시판으로 소통하세요</MainSubtitle>
          <UserInfo>
            <UserBadge>
              <User size={18} style={{ color: '#c084fc' }} />
              <Username>{user?.username}</Username>
            </UserBadge>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={18} />
              로그아웃
            </LogoutButton>
          </UserInfo>
        </Header>

        <BoardTabs>
          {boards.map(board => {
            const Icon = board.icon;
            return (
              <BoardTab
                key={board.id}
                active={currentBoard === board.id}
                bgColor={board.color}
                onClick={() => {
                  setCurrentBoard(board.id);
                  setSelectedPost(null);
                  setShowWriteForm(false);
                }}
              >
                <Icon size={20} />
                {board.name}
              </BoardTab>
            );
          })}
        </BoardTabs>

        <ContentContainer>
          {!selectedPost && !showWriteForm && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {React.createElement(currentBoardInfo.icon, { size: 28 })}
                  {currentBoardInfo.name}
                </CardTitle>
                <WriteButton
                  bgColor={currentBoardInfo.color}
                  onClick={() => setShowWriteForm(true)}
                >
                  글쓰기
                </WriteButton>
              </CardHeader>

              {loading ? (
                <LoadingText>로딩 중...</LoadingText>
              ) : posts.length === 0 ? (
                <EmptyText>첫 게시글을 작성해보세요!</EmptyText>
              ) : (
                <PostList>
                  {posts.map(post => (
                    <PostItem key={post.id} onClick={() => viewPost(post.id)}>
                      <PostHeader>
                        <PostTitle>
                          {post.is_important === 1 && (
                            <ImportantBadge>공지</ImportantBadge>
                          )}
                          {post.title}
                        </PostTitle>
                        <ViewCount>
                          <Eye size={14} />
                          {post.views}
                        </ViewCount>
                      </PostHeader>
                      <PostFooter>
                        <PostAuthor>
                          {currentBoard === 'anonymous' ? '익명' : post.author}
                          {currentBoard === 'department' && post.department && ` (${post.department})`}
                        </PostAuthor>
                        <PostDate>
                          {new Date(post.created_at).toLocaleDateString('ko-KR')}
                        </PostDate>
                      </PostFooter>
                    </PostItem>
                  ))}
                </PostList>
              )}
            </Card>
          )}

          {selectedPost && (
            <DetailCard>
              <DetailHeader>
                <DetailTitle>{selectedPost.title}</DetailTitle>
                <CloseButton onClick={() => setSelectedPost(null)}>
                  <X size={24} />
                </CloseButton>
              </DetailHeader>

              <DetailMeta>
                <span>작성자: {currentBoard === 'anonymous' ? '익명' : selectedPost.author}</span>
                {currentBoard === 'department' && selectedPost.department && (
                  <span>학과: {selectedPost.department}</span>
                )}
                <span>조회수: {selectedPost.views}</span>
                <span>{new Date(selectedPost.created_at).toLocaleString('ko-KR')}</span>
              </DetailMeta>

              <DetailContent>{selectedPost.content}</DetailContent>

              <ButtonGroup>
                <SecondaryButton onClick={() => setSelectedPost(null)}>
                  목록으로
                </SecondaryButton>
                {selectedPost.user_id === user?.id && (
                  <DeleteButton onClick={() => handleDelete(selectedPost.id)}>
                    <Trash2 size={16} />
                    삭제
                  </DeleteButton>
                )}
              </ButtonGroup>
            </DetailCard>
          )}

          {showWriteForm && (
            <FormCard>
              <DetailHeader>
                <CardTitle>글쓰기</CardTitle>
                <CloseButton onClick={() => setShowWriteForm(false)}>
                  <X size={24} />
                </CloseButton>
              </DetailHeader>

              <FormGroup>
                {currentBoard === 'department' && (
                  <>
                    <Input
                      type="text"
                      placeholder="작성자명"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="학과명"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </>
                )}

                {currentBoard === 'notice' && (
                  <>
                    <CheckboxLabel>
                      <Checkbox
                        type="checkbox"
                        checked={formData.is_important}
                        onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
                      />
                      <AlertCircle size={18} style={{ color: '#f87171' }} />
                      중요 공지로 표시
                    </CheckboxLabel>
                  </>
                )}

                <Input
                  type="text"
                  placeholder="제목"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />

                <Textarea
                  placeholder="내용을 입력하세요"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />

                <ButtonGroup>
                  <SubmitButton bgColor={currentBoardInfo.color} onClick={handleSubmit}>
                    작성완료
                  </SubmitButton>
                  <SecondaryButton onClick={() => setShowWriteForm(false)}>
                    취소
                  </SecondaryButton>
                </ButtonGroup>
              </FormGroup>
            </FormCard>
          )}
        </ContentContainer>
      </MainContainer>
    </PageContainer>
  );
};

export default BoardSystem;