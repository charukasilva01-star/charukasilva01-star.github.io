with open("index.html", "r") as file:
    content = file.read()
content = content.replace('src="assets/pooja/IMG_4683.JPG"', 'src="assets/pooja/post_pooja_net.jpg"')
content = content.replace('src="assets/pooja/IMG_4686.JPG"', 'src="assets/pooja/post_pooja_net_detail.jpg"')
content = content.replace('src="assets/pooja/IMG_4684.JPG"', 'src="assets/pooja/post_pooja_monk.jpg"')
content = content.replace('src="assets/pooja/IMG_4685.JPG"', 'src="assets/pooja/post_pooja_offerings.jpg"')
with open("index.html", "w") as file:
    file.write(content)
