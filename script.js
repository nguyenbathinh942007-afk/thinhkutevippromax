// === HÀM CHUNG: HIỆU ỨNG TRÁI TIM KHI CLICK ===
function createTouchHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('touch-heart');
    heart.innerText = '♥';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
}

document.addEventListener('click', (e) => {
    if (document.body.id !== 'page-final-2d') {
        createTouchHeart(e.clientX, e.clientY);
    }
});
document.addEventListener('touchstart', (e) => {
    if (document.body.id !== 'page-final-2d') {
        for (let i = 0; i < e.touches.length; i++) {
            createTouchHeart(e.touches[i].clientX, e.touches[i].clientY);
        }
    }
});


// === LOGIC CHO TRANG MỞ ĐẦU (index.html) ===
if (document.body.id === 'page-intro') {
    const nextButton = document.getElementById('next-page-button');
    const music = document.getElementById('romantic-music');
    
    nextButton.addEventListener('click', () => {
        music.play().catch(e => console.log("Lỗi phát nhạc: " + e));
        // Chuyển hướng sang trang tỏ tình
        window.location.href = 'confession.html'; 
    });
}


// === LOGIC CHO TRANG TỎ TÌNH (confession.html) ===
if (document.body.id === 'page-confession') {
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const memeArea = document.getElementById('meme-area');
    let yesButtonSize = 1;
    let refuseCount = 0;
    const maxRefuse = 10;
    let music = document.getElementById('romantic-music');
    
    // DANH SÁCH CÁC CỤM TỪ ĐỒNG Ý
    const yesPhrases = [
        "Đồng ý nha! ♥", // 0
        "Đồng ý đi!", // 1
        "Huhu, đồng ý nhá 🥲", // 2
        "Đồng ý mò 🥹", // 3
        "Đồng ý nhó 🥺", // 4
        "Bắt buộc phải đồng ý!!! 🤬", // 5
        "OK nhó 😍", // 6
    ];
    
    if (music) { music.play().catch(e => console.log("Lỗi phát nhạc: " + e)); }

    // Logic Nút KHÔNG ĐỒNG Ý (Kích thước VĨNH VIỄN & Thay chữ)
    noButton.addEventListener('click', () => {
        
        refuseCount++;

        // 1. Hiển thị meme
        memeArea.classList.remove('hidden');

        // 2. Thay đổi chữ nút Đồng Ý
        const nextPhraseIndex = (refuseCount - 1) % yesPhrases.length;
        yesButton.innerText = yesPhrases[nextPhraseIndex];
        
        // 3. Phóng to nút ĐỒNG Ý VĨNH VIỄN
        yesButtonSize += 0.5; // Tăng 50% mỗi lần
        yesButton.style.transform = `scale(${yesButtonSize})`;

        // 4. Cập nhật vị trí nút NO để không bị che hoàn toàn ngay lập tức
        if (refuseCount < maxRefuse) {
            const offset = refuseCount * 5; 
            noButton.style.transform = `translateX(${offset}px)`;
        }
        
        // 5. Kiểm tra giới hạn 10 lần
        if (refuseCount >= maxRefuse) {
            noButton.disabled = true;
            noButton.style.opacity = 0; 
            noButton.style.zIndex = 1; 
            memeArea.innerHTML = '<p class="meme-text">Phải đồng ý 🤬</p>';
        }

        // Tắt meme sau 2 giây
        setTimeout(() => {
            if (refuseCount < maxRefuse) {
                 memeArea.classList.add('hidden');
            }
        }, 2000); 
    });

    // Logic Nút ĐỒNG Ý (Thành công)
    yesButton.addEventListener('click', () => {
        if (music) music.pause();
        showFinalScreen2D(); 
    });
}


// =========================================================
// === HÀM TẠO TRANG KẾT THÚC 2D - ĐÃ TĂNG TỐC ĐỘ BAY LÊN ===
// =========================================================
function showFinalScreen2D() {
    // Xóa hết nội dung cũ
    document.body.innerHTML = ''; 
    document.body.id = 'page-final-2d'; 
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#000000'; // Nền đen tuyệt đối
    
    // Thêm Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'heart-canvas';
    document.body.appendChild(canvas);
    
    // Thêm Text Kết Thúc
    const h1 = document.createElement('h1');
    h1.innerText = 'CHÚC MỪNG BẠN ĐÃ BỊ TÔI LÙA ✨';
    h1.style.color = '#fff';
    h1.style.position = 'fixed';
    h1.style.top = '50%';
    h1.style.left = '50%';
    h1.style.transform = 'translate(-50%, -50%)';
    h1.style.zIndex = '100';
    h1.style.fontSize = '3em';
    h1.style.textShadow = '0 0 10px #ff69b4, 0 0 30px #ff69b4'; 
    document.body.appendChild(h1);
    
    // Logic Canvas 2D
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const hearts = [];
    const numHearts = 150; 
    
    // Hàm vẽ hình trái tim (sử dụng bezier curves)
    function drawHeart(c, x, y, size) {
        c.beginPath();
        c.moveTo(x, y + size / 4);
        c.bezierCurveTo(x + size / 2, y - size / 2, x + size, y, x, y + size);
        c.bezierCurveTo(x - size, y, x - size / 2, y - size / 2, x, y + size / 4);
        c.closePath();
        c.fill();
        c.stroke(); // Vẽ viền trái tim
    }

    for (let i = 0; i < numHearts; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 200, 
            size: Math.random() * 15 + 20, 
            speed: Math.random() * 1.5 + 0.5, // <--- ĐÃ SỬA: Tăng tốc độ bay lên (tối đa 1.5 + 0.5 = 2.0)
            opacity: Math.random() * 0.5 + 0.5, 
            color: '#ff69b4' // Hồng đậm (Hot Pink)
        });
    }

    function animate() {
        // Xóa màn hình với độ trong suốt thấp (tạo hiệu ứng vệt mờ rất nhẹ)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        hearts.forEach(h => {
            // Bay lên
            h.y -= h.speed;
            
            // Xoay nhẹ nhàng (tùy chọn)
            h.x += Math.sin(h.y * 0.01) * 0.5;

            // Reset trái tim khi bay ra khỏi màn hình
            if (h.y < -h.size) {
                h.y = canvas.height + h.size;
                h.x = Math.random() * canvas.width;
            }

            // Thiết lập style
            ctx.fillStyle = h.color;
            ctx.globalAlpha = h.opacity;
            
            // Viền trái tim: ĐỎ SÁNG/HỒNG ĐẬM
            ctx.strokeStyle = '#ff3366'; // Đỏ hồng mạnh mẽ
            ctx.lineWidth = 2;

            // Hiệu ứng phát sáng nhẹ nhàng
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ff69b4'; // Màu phát sáng hồng
            
            // Vẽ trái tim
            drawHeart(ctx, h.x, h.y, h.size);
        });

        requestAnimationFrame(animate);
    }
    
    animate();
}
