import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Bell, Eye, Trash2, X, AlertCircle, LogOut, User } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const BoardSystem = () => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [user, setUser] = useState(null);
 const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
 const [authForm, setAuthForm] = useState({ username: '', password: '' });

 const [currentBoard, setCurrentBoard] = useState('anonymous');
 const [posts, setPosts] = useState([]);
 const [selectedPost, setSelectedPost] = useState(null);
 const [showWriteForm, setShowWriteForm] = useState(false);
 const [loading, setLoading] = useState(false);

 // 폼 상태
 const [formData, setFormData] = useState({
 title: '',
 content: '',
 author: '',
 department: '',
 is_important: false
 });

 // 세션 확인
 useEffect(() => {
 checkSession();
 }, []);

 // 게시글 목록 불러오기
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

 if (currentBoard === 'notice' && !formData.author) {
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
 if (!confirm('정말 삭제하시겠습니까?')) return;

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
 { id: 'anonymous', name: '익명게시판', icon: MessageSquare, color: 'bg-purple-500' },
 { id: 'department', name: '과 게시판', icon: Users, color: 'bg-blue-500' },
 { id: 'notice', name: '공지사항', icon: Bell, color: 'bg-red-500' }
 ];

 const currentBoardInfo = boards.find(b => b.id === currentBoard);

 // 로그인 화면
 if (!isAuthenticated) {
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
 <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-md w-full">
 <div className="text-center mb-8">
 <h1 className="text-4xl font-bold text-white mb-2">🔥 쌈뽕 게시판</h1>
 <p className="text-purple-300">로그인하여 게시판을 이용하세요</p>
 </div>

 <div className="flex gap-2 mb-6">
 <button
 onClick={() => setAuthMode('login')}
 className={`flex-1 py-2 rounded-lg font-semibold transition ${
 authMode === 'login'
 ? 'bg-purple-500 text-white'
 : 'bg-slate-700 text-slate-300'
 }`}
 >
 로그인
 </button>
 <button
 onClick={() => setAuthMode('register')}
 className={`flex-1 py-2 rounded-lg font-semibold transition ${
 authMode === 'register'
 ? 'bg-purple-500 text-white'
 : 'bg-slate-700 text-slate-300'
 }`}
 >
 회원가입
 </button>
 </div>

 <div className="space-y-4">
 <input
 type="text"
 placeholder="아이디"
 value={authForm.username}
 onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
 onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />
 <input
 type="password"
 placeholder="비밀번호"
 value={authForm.password}
 onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
 onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />
 <button
 onClick={handleAuth}
 className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
 >
 {authMode === 'login' ? '로그인' : '회원가입'}
 </button>
 </div>

 <div className="mt-6 text-center text-sm text-slate-400">
 {authMode === 'login' ? (
 <p>계정이 없으신가요? <button onClick={() => setAuthMode('register')} className="text-purple-400 hover:underline">회원가입</button></p>
 ) : (
 <p>이미 계정이 있으신가요? <button onClick={() => setAuthMode('login')} className="text-purple-400 hover:underline">로그인</button></p>
 )}
 </div>

 <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-sm text-slate-300">
 <p className="font-semibold mb-2">ℹ️ 세션 정보</p>
 <p>• 로그인 후 1시간 동안 세션 유지</p>
 <p>• 글 작성/삭제는 본인만 가능</p>
 </div>
 </div>
 </div>
 );
 }

 // 게시판 메인 화면
 return (
 <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
 <div className="container mx-auto px-4 py-8">
 {/* 헤더 */}
 <div className="text-center mb-8">
 <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
 🔥 쌈뽕 게시판
 </h1>
 <p className="text-purple-300">세 가지 게시판으로 소통하세요</p>
 <div className="flex items-center justify-center gap-2 mt-4">
 <div className="bg-slate-800/50 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
 <User size={18} className="text-purple-400" />
 <span className="text-white font-semibold">{user?.username}</span>
 </div>
 <button
 onClick={handleLogout}
 className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2 transition"
 >
 <LogOut size={18} />
 로그아웃
 </button>
 </div>
 </div>

 {/* 게시판 탭 */}
 <div className="flex gap-4 mb-8 justify-center flex-wrap">
 {boards.map(board => {
 const Icon = board.icon;
 return (
 <button
 key={board.id}
 onClick={() => {
 setCurrentBoard(board.id);
 setSelectedPost(null);
 setShowWriteForm(false);
 }}
 className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
 currentBoard === board.id
 ? `${board.color} text-white shadow-lg scale-105`
 : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
 }`}
 >
 <Icon size={20} />
 {board.name}
 </button>
 );
 })}
 </div>

 {/* 메인 컨텐츠 */}
 <div className="max-w-6xl mx-auto">
 {!selectedPost && !showWriteForm && (
 <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 shadow-2xl border border-slate-700">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
 {React.createElement(currentBoardInfo.icon, { size: 28 })}
 {currentBoardInfo.name}
 </h2>
 <button
 onClick={() => setShowWriteForm(true)}
 className={`${currentBoardInfo.color} text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition`}
 >
 글쓰기
 </button>
 </div>

 {loading ? (
 <div className="text-center py-12 text-slate-400">로딩 중...</div>
 ) : posts.length === 0 ? (
 <div className="text-center py-12 text-slate-400">
 첫 게시글을 작성해보세요!
 </div>
 ) : (
 <div className="space-y-3">
 {posts.map(post => (
 <div
 key={post.id}
 onClick={() => viewPost(post.id)}
 className="bg-slate-700/50 p-4 rounded-xl hover:bg-slate-700 cursor-pointer transition group"
 >
 <div className="flex justify-between items-start mb-2">
 <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition flex items-center gap-2">
 {post.is_important === 1 && (
 <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">공지</span>
 )}
 {post.title}
 </h3>
 <span className="flex items-center gap-1 text-slate-400 text-sm">
 <Eye size={14} />
 {post.views}
 </span>
 </div>
 <div className="flex justify-between items-center text-sm">
 <span className="text-slate-400">
 {currentBoard === 'anonymous' ? '익명' : post.author}
 {currentBoard === 'department' && post.department && ` (${post.department})`}
 </span>
 <span className="text-slate-500">
 {new Date(post.created_at).toLocaleDateString('ko-KR')}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* 게시글 상세보기 */}
 {selectedPost && (
 <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-slate-700">
 <div className="flex justify-between items-start mb-6">
 <h2 className="text-3xl font-bold text-white">{selectedPost.title}</h2>
 <button
 onClick={() => setSelectedPost(null)}
 className="text-slate-400 hover:text-white transition"
 >
 <X size={24} />
 </button>
 </div>

 <div className="flex gap-4 mb-6 text-sm text-slate-400 border-b border-slate-700 pb-4">
 <span>
 작성자: {currentBoard === 'anonymous' ? '익명' : selectedPost.author}
 </span>
 {currentBoard === 'department' && selectedPost.department && (
 <span>학과: {selectedPost.department}</span>
 )}
 <span>조회수: {selectedPost.views}</span>
 <span>{new Date(selectedPost.created_at).toLocaleString('ko-KR')}</span>
 </div>

 <div className="text-slate-200 mb-8 whitespace-pre-wrap leading-relaxed min-h-[200px]">
 {selectedPost.content}
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setSelectedPost(null)}
 className="bg-slate-700 text-white px-6 py-2 rounded-lg hover:bg-slate-600 transition"
 >
 목록으로
 </button>
 {selectedPost.user_id === user?.id && (
 <button
 onClick={() => handleDelete(selectedPost.id)}
 className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
 >
 <Trash2 size={16} />
 삭제
 </button>
 )}
 </div>
 </div>
 )}

 {/* 글쓰기 폼 */}
 {showWriteForm && (
 <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 shadow-2xl border border-slate-700">
 <div className="flex justify-between items-center mb-6">
 <h2 className="text-2xl font-bold text-white">글쓰기</h2>
 <button
 onClick={() => setShowWriteForm(false)}
 className="text-slate-400 hover:text-white transition"
 >
 <X size={24} />
 </button>
 </div>

 <div className="space-y-4">
 {currentBoard === 'department' && (
 <>
 <input
 type="text"
 placeholder="작성자명"
 value={formData.author}
 onChange={(e) => setFormData({ ...formData, author: e.target.value })}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />
 <input
 type="text"
 placeholder="학과명"
 value={formData.department}
 onChange={(e) => setFormData({ ...formData, department: e.target.value })}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />
 </>
 )}

 {currentBoard === 'notice' && (
 <>
 <input
 type="text"
 placeholder="작성자명"
 value={formData.author}
 onChange={(e) => setFormData({ ...formData, author: e.target.value })}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />
 <label className="flex items-center gap-2 text-white cursor-pointer">
 <input
 type="checkbox"
 checked={formData.is_important}
 onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
 className="w-5 h-5"
 />
 <AlertCircle size={18} className="text-red-400" />
 중요 공지로 표시
 </label>
 </>
 )}

 <input
 type="text"
 placeholder="제목"
 value={formData.title}
 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
 />

 <textarea
 placeholder="내용을 입력하세요"
 value={formData.content}
 onChange={(e) => setFormData({ ...formData, content: e.target.value })}
 className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none min-h-[200px]"
 />

 <div className="flex gap-3">
 <button
 onClick={handleSubmit}
 className={`${currentBoardInfo.color} text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition`}
 >
 작성완료
 </button>
 <button
 onClick={() => setShowWriteForm(false)}
 className="bg-slate-700 text-white px-8 py-3 rounded-lg hover:bg-slate-600 transition"
 >
 취소
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default BoardSystem;