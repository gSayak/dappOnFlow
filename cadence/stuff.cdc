pub contract stuff{
    pub var name :String

    pub fun changeName(newName: String ){
        log(newName)
        self.name = newName
    } 

    init(){
        self.name = "Sayak Ghosh"
    }
}