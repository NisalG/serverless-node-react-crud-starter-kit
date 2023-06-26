
//Available policies - https://www.npmjs.com/package/@serverless/safeguards-plugin#safeguards-available-with-plugin

export const safeguards = [
    {
        safeguard: "no-wild-iam-role-statements",
        title: "No IAM role with * wildcard",
        enforcementLevel: "warning"
    },
    {
        safeguard: "no-secret-env-vars",
        title: "Do not contain environment variables values which follow patterns of common credential formats",
        enforcementLevel: 'warning'
    },
    {
        safeguard: "allowed-runtimes",
        title: "Only allow nodejs16.x",
        config: ["nodejs16.x"],
        enforcementLevel: 'warning'

    },
    {
        safeguard: "allowed-regions",
        title: "Allowed regions",
        config: ["us-east-1", "ca-central-1"],
        // enforcementLevel is default to error
    }
]

