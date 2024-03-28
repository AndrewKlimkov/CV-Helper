import { Button, Flex, Typography } from "antd";
import { FormProject } from "@/components/FormProject";
import { useStore } from "@/app/store";
import { observer } from "mobx-react-lite";

const { Title } = Typography;

// TODO should make this component more designable
export const ListProjects = observer(() => {
  const {
    projects: { projects, addEmptyProject },
  } = useStore();

  return (
    <Flex gap="middle" vertical style={{ width: "30%" }}>
      <Title level={3}>Projects</Title>
      {projects.map((project) => {
        return <FormProject key={project.id} projectData={project} />;
      })}
      <Button onClick={addEmptyProject}>Add project</Button>
    </Flex>
  );
});
