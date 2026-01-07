import { ImageKit } from "@imagekit/nodejs";


const imagekit =new ImageKit({
    privateKey:process.env.IMAGE_KIT_PRIVATE_KEY,
})

export default imagekit;