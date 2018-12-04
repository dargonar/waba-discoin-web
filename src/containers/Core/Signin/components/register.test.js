import { accountGenerator } from "./register";
import { expect } from "chai";

it("Lowercase accountName", () => {
  expect(accountGenerator("Bussines")).equal("bussines");
});

it("Change space to dash", () => {
  expect(accountGenerator("bussines example")).equal("bussines.example");
});

it("Remove extra characters", () => {
  expect(accountGenerator("#bussines!!!")).equal("bussines");
});

it("All test in one", () => {
  let bussinesName = "áàäâª ÁÀÂÄ doéèëêÉÈÊËreíìïîÍÌÏÎmióòöôÓÒÖÔfaúùüûÚÙÛÜsolñÑçÇlasi¨º-~#@|!,·$%&/()?¡¿[^</>]+}{¨´><,:.";
  let accountName = "aaaaa.aaaa.doeeeeeeeereiiiiiiiimioooooooofauuuuuuuusolnncclasio.x|";

  expect(accountGenerator(bussinesName)).equal(accountName);
});
