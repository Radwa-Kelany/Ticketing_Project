export const natsWrapper = {
  client: {
    // Here I mock the publish method of stan client in nats library
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // },
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void)=>{
      callback();
    })
  }
};
