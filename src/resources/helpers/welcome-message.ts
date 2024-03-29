export const welcomeMessage = (): void => {
  console.log(`
  ███╗░░░███╗░█████╗░██╗███╗░░██╗  ░█████╗░██╗░░██╗░█████╗░██╗███╗░░██╗███████╗
  ████╗░████║██╔══██╗██║████╗░██║  ██╔══██╗██║░░██║██╔══██╗██║████╗░██║╚════██║
  ██╔████╔██║███████║██║██╔██╗██║  ██║░░╚═╝███████║███████║██║██╔██╗██║░░███╔═╝
  ██║╚██╔╝██║██╔══██║██║██║╚████║  ██║░░██╗██╔══██║██╔══██║██║██║╚████║██╔══╝░░
  ██║░╚═╝░██║██║░░██║██║██║░╚███║  ╚█████╔╝██║░░██║██║░░██║██║██║░╚███║███████╗
  ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝  ░╚════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝╚═╝░░╚══╝╚══════╝
  
  ██████╗░░█████╗░░█████╗░██╗░░██╗░░░░░░███████╗███╗░░██╗██████╗░
  ██╔══██╗██╔══██╗██╔══██╗██║░██╔╝░░░░░░██╔════╝████╗░██║██╔══██╗
  ██████╦╝███████║██║░░╚═╝█████═╝░█████╗█████╗░░██╔██╗██║██║░░██║
  ██╔══██╗██╔══██║██║░░██╗██╔═██╗░╚════╝██╔══╝░░██║╚████║██║░░██║
  ██████╦╝██║░░██║╚█████╔╝██║░╚██╗░░░░░░███████╗██║░╚███║██████╔╝
  ╚═════╝░╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝░░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░
`);
  console.log(`🔥Server is listenning on port http://localhost:${process.env['PORT'] || 3000}🔥`);
};
