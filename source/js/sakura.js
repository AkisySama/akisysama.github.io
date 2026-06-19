(function() {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999999';
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var petals = [];
    var petalCount = 60;
    var mouseX = -1000;
    var mouseY = -1000;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    window.addEventListener('mouseout', function() {
        mouseX = -1000;
        mouseY = -1000;
    });

    function Petal() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 6 + 10;
        this.speedY = Math.random() * 0.75 + 0.5;
        this.speedX = Math.random() * 0.75 - 0.375;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
        this.scaleX = 1;
        this.scaleXSpeed = Math.random() * 0.015 + 0.005;
        this.scaleXDir = Math.random() > 0.5 ? 1 : -1;
    }

    Petal.prototype.update = function() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.angle += this.spin;

        this.scaleX += this.scaleXSpeed * this.scaleXDir;
        if (this.scaleX > 1 || this.scaleX < -1) {
            this.scaleXDir *= -1;
        }
        
        var dx = this.x - mouseX;
        var dy = this.y - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = 150;
        if (dist < maxDist) {
            var force = (maxDist - dist) / maxDist;
            this.x += (dx / dist) * force * 5;
            this.y += (dy / dist) * force * 5;
        }

        if (this.y > canvas.height + this.size * 2) {
            this.y = -this.size * 2;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width + this.size * 2) {
            this.x = -this.size * 2;
        } else if (this.x < -this.size * 2) {
            this.x = canvas.width + this.size * 2;
        }
    };

    function drawSakuraPetal(size) {
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.12);
        ctx.bezierCurveTo(-size * 0.55, -size * 0.35, -size * 0.48, -size * 0.92, -size * 0.12, -size * 1.08);
        ctx.bezierCurveTo(-size * 0.04, -size * 0.98, size * 0.04, -size * 0.98, size * 0.12, -size * 1.08);
        ctx.bezierCurveTo(size * 0.48, -size * 0.92, size * 0.55, -size * 0.35, 0, -size * 0.12);
        ctx.closePath();
        ctx.fill();
    }

    function drawSakuraBlossom(size) {
        var petalSize = size * 0.72;
        var gradient = ctx.createLinearGradient(0, 0, 0, -petalSize);
        gradient.addColorStop(0, 'rgba(255, 228, 238, 0.9)');
        gradient.addColorStop(1, 'rgba(255, 170, 200, 0.68)');

        ctx.fillStyle = gradient;
        for (var i = 0; i < 5; i++) {
            drawSakuraPetal(petalSize);
            ctx.rotate((Math.PI * 2) / 5);
        }

        ctx.beginPath();
        ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 214, 130, 0.85)';
        ctx.fill();
    }

    Petal.prototype.draw = function() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scaleX, 1);
        drawSakuraBlossom(this.size);
        ctx.restore();
    };

    for (var i = 0; i < petalCount; i++) {
        petals.push(new Petal());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < petals.length; i++) {
            petals[i].update();
            petals[i].draw();
        }
        requestAnimationFrame(animate);
    }
    
    animate();
})();
