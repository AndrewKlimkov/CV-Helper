import Docxtemplater from "docxtemplater";
import PizZip, { LoadData } from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import expressionParser from "docxtemplater/expressions";
import { Button } from "antd";
import { useStores } from "@/store/hooks/root-store-context";
import { Technology } from "@/abstraction/store/fields";
import { observer } from "mobx-react-lite";
import { getDataForDocumentGenerating } from "./utils";
import { convertMonthsToYears } from "@/utils/convertMonthsToYears";

function loadFile(url: string, callback: (err: Error, data: string) => void) {
  PizZipUtils.getBinaryContent(url, callback);
}

export const GenerateDocumentButton = observer(() => {
  const {
    projects: { table },
  } = useStores();

  const generateDocument = () => {
    const dataForGenerating = getDataForDocumentGenerating(table);

    loadFile("/tableTemplate.docx", function (error: Error, content: LoadData) {
      if (error) {
        throw error;
      }

      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: expressionParser,
      });
      doc.render({
        getNames: (scope: { technologies: Technology[] }) =>
          scope.technologies.reduce((acc, item) => acc + item.name + "\n", ""),
        getRanges: (scope: { technologies: Technology[] }) =>
          scope.technologies.reduce(
            (acc, item) => acc + convertMonthsToYears(item.range) + "\n",
            "",
          ),
        getLastUsed: (scope: { technologies: Technology[] }) =>
          scope.technologies.reduce((acc, item) => acc + item.lastUsed + "\n", ""),
        ...dataForGenerating,
      });
      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }); //Output the document using Data-URI
      saveAs(out, "cv.docx");
    });
  };
  return <Button onClick={generateDocument}>Generate</Button>;
});
