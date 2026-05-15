import { useMutation } from "@tanstack/react-query";
import { generatorApi } from "@/api/generatorApi";
import type { GenerateResponse, GenerateScriptPayload } from "@/types/generator";

export function useGenerateScript() {
    return useMutation<GenerateResponse, Error, GenerateScriptPayload>({
        mutationFn: generatorApi.generateScript,
    });
}
