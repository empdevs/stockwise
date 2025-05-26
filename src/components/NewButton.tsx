import { Button } from "antd";

const NewButton = (props: { onClick: Function, text: string }) => {
    return (
        <Button
            type="primary"
            style={{
                backgroundColor: '#32a89b', // custom green color (adjust if needed)
                borderColor: '#32a89b',
                borderRadius: '999px', // pill shape
                fontWeight: 'bold',
                padding: '0 24px',
                height: '32px',
            }}
            onClick={() => props.onClick()}
        >
            {props.text}
        </Button>
    );
};

export default NewButton;