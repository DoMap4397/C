const FormController = ({ onSubmit, children }) => {
    return (
        <form autoComplete='off' onSubmit={onSubmit}>
            {children}
        </form>
    );
};

export default FormController;
