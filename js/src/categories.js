import React from 'react'

class Category extends React.Component{
    render(){
        let active="btn "+(this.props.value ? " btn-primary active" : "btn-default");
        return (
             <button type="button" className={active} onClick={this.props.onChange}>{this.props.title}</button>
        );
    }
}

class CategoryGroup extends React.Component{
    render(){
        var categories = this.props.data.map(function(category){
            if(category.category_group===this.props.id){
                return (
                    <Category title={category.title} value={category.value} key={category.id} onChange={(e)=>this.props.onChange(category.id)}/>
                  )
            }
        }.bind(this))
        var newCategories=[]
        for(let i=0;i<categories.length;i++){
            if(categories[i]!==undefined){
                newCategories.push(categories[i])
            }
        }
        return(
            <div className="row">
            <div className="col-sm-5"> 
                {this.props.title}:
            </div>
            <div className="col-sm-7"> 
             <span className="btn-group btn-group-xs" role="group" aria-label="...">
               {newCategories}
              </span>
            </div>
            </div>      
        );
    }
}


export class CategoryGroupList extends React.Component{

    render(){
        let categoryGroups = this.props.categoryGroups.map(function(categorygroup) {
          return (
            <CategoryGroup title={categorygroup.title} key={categorygroup.id} id={categorygroup.id} data={this.props.categories} onChange={this.props.categoryChanged}/>
          )
        }.bind(this))
        console.log("categoryGroups")
        console.log(categoryGroups)
        return (
            <div>
            <h5><strong>Kategórie</strong></h5>
            {categoryGroups} 
            </div>
        );
    }
}
