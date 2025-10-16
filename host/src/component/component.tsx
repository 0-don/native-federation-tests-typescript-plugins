import { AnotherButton } from "@remote/another-button";
import Button from "@remote/button";

const Component = () => (
  <div>
    <Button onClick={console.log} />
    <AnotherButton onClick={console.error} />
  </div>
);

export default Component;
