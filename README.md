# band-rust demo
1. Clone Repository
2. Install Rust [doc here](https://www.rust-lang.org/tools/install)
3. Modify ```lib.rs``` file in ```scr``` according to your requirement and compile it using the below command ```RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown```
4. Once compiled above file, pick the ```hellow_world.wasm``` file and deploy it manually [here](https://builder-hackathon.vercel.app/deploy)
5. Further Interact with the deployed Oracle script js. see ```band.js``` file
